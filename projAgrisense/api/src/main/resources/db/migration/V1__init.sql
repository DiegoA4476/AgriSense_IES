CREATE EXTENSION IF NOT EXISTS timescaledb;

CREATE TABLE IF NOT EXISTS farms (
    id          BIGSERIAL    PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    location    VARCHAR(255) NOT NULL,
    zipcode     VARCHAR(20)  NOT NULL,
    farmer_id   VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS barns (
    id       BIGSERIAL    PRIMARY KEY,
    name     VARCHAR(255) NOT NULL,
    farm_id  BIGINT       REFERENCES farms(id)
);

CREATE TABLE IF NOT EXISTS animals (
    id         BIGSERIAL  PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    type    VARCHAR(50)  NOT NULL,
    height     NUMERIC(6,2),
    weight     NUMERIC(6,2), 
    barn_id    BIGINT       NOT NULL,
    CONSTRAINT fk_barn FOREIGN KEY (barn_id) REFERENCES barns(id) ON DELETE CASCADE
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
