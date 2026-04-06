INSERT INTO animal_metric (time, animal_id, heart_rate, temperature, stress, movement)
SELECT
    generate_series(
        '2026-01-01 00:00:00+00'::timestamptz,
        '2026-04-03 23:57:00+00'::timestamptz,
        '3 minutes'::interval
    ) AS time,
    'cow-001',
    55 + floor(random() * 20)::int,
    round((38.0 + random())::numeric, 2),
    round((random() * 10)::numeric, 1),
    floor(random() * 21)::int;

INSERT INTO animal_weight (time, animal_id, weight)
SELECT
    generate_series(
        '2026-01-01 00:00:00+00'::timestamptz,
        '2026-04-03 23:00:00+00'::timestamptz,
        '1 hour'::interval
    ) AS time,
    'cow-001',
    round((318 + random() * 4)::numeric, 1);
