-- Align the live unknowns table with the application contract.
-- Idempotent so it is safe for the existing deployed database and fresh environments.

alter table public.unknowns
  add column if not exists review_status public.review_status not null default 'open';
