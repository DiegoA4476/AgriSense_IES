CREATE EXTENSION IF NOT EXISTS timescaledb;

CREATE TABLE IF NOT EXISTS barns (
    id       BIGSERIAL    PRIMARY KEY,
    name     VARCHAR(255) NOT NULL,
    location VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS animal_metric (
    time        TIMESTAMPTZ   NOT NULL,
    animal_id   VARCHAR(50)   NOT NULL,
    heart_rate  INT,
    temperature NUMERIC(5,2),
    stress      NUMERIC(4,1),
    movement    INT
);

SELECT create_hypertable('animal_metric', 'time', if_not_exists => TRUE);

CREATE TABLE IF NOT EXISTS animal_weight (
    time      TIMESTAMPTZ  NOT NULL,
    animal_id VARCHAR(50)  NOT NULL,
    weight    NUMERIC(6,1)
);

SELECT create_hypertable('animal_weight', 'time', if_not_exists => TRUE);
