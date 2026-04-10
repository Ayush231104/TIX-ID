create or replace function public.increment_discount_usage(d_id uuid)
returns void as $$
begin
  update public.discount
  set usage_count = coalesce(usage_count, 0) + 1
  where id = d_id;
end;
$$ language plpgsql security definer;