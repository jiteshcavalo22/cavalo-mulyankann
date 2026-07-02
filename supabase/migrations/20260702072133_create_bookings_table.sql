/*
# Cavalo Moolyankann — Create bookings table

1. New Tables
   - `bookings`
     - id (uuid, primary key)
     - user_id (uuid, references auth.users, default auth.uid())
     - booking_ref (text, e.g. CV-20491)
     - brand, model, rto, gvw (text)
     - date (date), time_slot (text), city (text)
     - status (text: pending/confirmed/assigned/ready)
     - price, discount_pct, total (integer)
     - coupon_code, payment_method (text)
     - inspector_name, inspector_phone (text)
     - inspector_rating (numeric)
     - score (integer)
     - created_at (timestamptz)

2. Security
   - RLS enabled
   - 4 separate policies (SELECT/INSERT/UPDATE/DELETE) scoped to authenticated users owning their rows
*/

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_ref text NOT NULL,
  brand text,
  model text,
  rto text,
  gvw text,
  date date,
  time_slot text,
  city text,
  status text NOT NULL DEFAULT 'pending',
  price integer DEFAULT 0,
  coupon_code text,
  discount_pct integer DEFAULT 0,
  total integer DEFAULT 0,
  payment_method text,
  inspector_name text,
  inspector_phone text,
  inspector_rating numeric(3,1),
  score integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_bookings" ON bookings;
CREATE POLICY "select_own_bookings" ON bookings FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_bookings" ON bookings;
CREATE POLICY "insert_own_bookings" ON bookings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_bookings" ON bookings;
CREATE POLICY "update_own_bookings" ON bookings FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_bookings" ON bookings;
CREATE POLICY "delete_own_bookings" ON bookings FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
