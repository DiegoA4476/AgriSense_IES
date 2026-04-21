CREATE TABLE IF NOT EXISTS farms (
    id          BIGSERIAL    PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    location    VARCHAR(255) NOT NULL,
    zipcode     VARCHAR(20)  NOT NULL,
    farmer_id   VARCHAR(255) NOT NULL
);

ALTER TABLE barns ADD COLUMN IF NOT EXISTS farm_id BIGINT REFERENCES farms(id);
