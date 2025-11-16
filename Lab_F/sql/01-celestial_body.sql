CREATE TABLE celestial_body (
    id INTEGER NOT NULL CONSTRAINT celestial_body_pk PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    radius INTEGER NOT NULL
);