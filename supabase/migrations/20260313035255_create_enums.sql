-- Movie status
create type public.movie_status_enum as enum (
  'upcoming',
  'streaming'
);

-- Booking status
create type public.booking_status_enum as enum (
  'pending',
  'paid',
  'cancelled'
);

-- Genre
create type public.genre_enum as enum (
  'action', 'war', 'horror', 'crime', 'thriller', 'western', 'romance'
);

-- Age rating (CBFC India)
create type public.age_rating_enum as enum (
  'U', 'UA', 'UA7+', 'UA13+', 'UA16+', 'A', 'S'
);

-- Payment method
create type public.payment_method_enum as enum (
  'card', 'upi', 'wallet'
);

-- Payment status
create type public.payment_status_enum as enum (
  'pending', 'succeeded', 'failed', 'refunded'
);

-- Refund status
create type public.refund_status_enum as enum (
  'null', 'pending', 'succeeded', 'failed'
);

-- Reservation status
create type public.reservation_status_enum as enum (
  'available', 'hold', 'released'
);

-- Discount type
create type public.discount_type_enum as enum (
  'percent', 'flat'
);

-- Booking seat status
create type public.booking_seat_status_enum as enum (
  'reserved', 'confirmed', 'cancelled'
);