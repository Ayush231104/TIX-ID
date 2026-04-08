CREATE OR REPLACE FUNCTION sync_booking_seats(
  p_showtime_id UUID,
  p_user_id UUID,
  p_seats_to_add UUID[],
  p_seats_to_del UUID[]
)
RETURNS json AS $$
DECLARE
  v_conflict_seat UUID;
BEGIN
  -- 1. Process Deletions First (Frees up seats in case the user is swapping)
  IF array_length(p_seats_to_del, 1) > 0 THEN
    DELETE FROM seat_locked
    WHERE showtime_id = p_showtime_id
      AND user_id = p_user_id
      AND seat_id = ANY(p_seats_to_del);
  END IF;

  -- 2. Process Additions
  IF array_length(p_seats_to_add, 1) > 0 THEN
    
    -- CONFLICT CHECK: Are any of these seats taken by someone else?
    -- Checks both active holds (seat_locked) and actual bookings (booking_seats)
    SELECT seat_id INTO v_conflict_seat
    FROM (
        SELECT seat_id FROM seat_locked 
        WHERE showtime_id = p_showtime_id 
          AND seat_id = ANY(p_seats_to_add) 
          AND user_id != p_user_id 
          AND expires_at > now()
        UNION ALL
        SELECT seat_id FROM booking_seats 
        WHERE showtime_id = p_showtime_id 
          AND seat_id = ANY(p_seats_to_add) 
          AND booking_seat_status IN ('confirmed', 'reserved')
    ) AS conflicts
    LIMIT 1;

    -- If a conflict is found, immediately abort and return the conflicting seat ID
    IF FOUND THEN
      RETURN json_build_object(
        'success', false, 
        'error', 'SEAT_CONFLICT', 
        'seat_id', v_conflict_seat
      );
    END IF;

    -- No conflicts? Safely insert/update the new holds
    INSERT INTO seat_locked (showtime_id, seat_id, user_id, expires_at, reservation_status)
    SELECT p_showtime_id, unnest(p_seats_to_add), p_user_id, now() + interval '10 minutes', 'hold'
    ON CONFLICT (showtime_id, seat_id) 
    DO UPDATE SET
        user_id = EXCLUDED.user_id,
        expires_at = EXCLUDED.expires_at,
        reservation_status = EXCLUDED.reservation_status;
  END IF;

  -- 3. Return Success & the Ground Truth of what this user currently holds
  RETURN json_build_object(
    'success', true,
    'held_seats', (
      SELECT COALESCE(json_agg(seat_id), '[]'::json)
      FROM seat_locked
      WHERE showtime_id = p_showtime_id AND user_id = p_user_id
    )
  );
END;
$$ LANGUAGE plpgsql;