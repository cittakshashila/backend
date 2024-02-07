-- CREATE DATABASE tk;
-- USE tk;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4(),
    name VARCHAR(50),
    email VARCHAR(50),
    clg_name VARCHAR(100),
    phone_no VARCHAR(20),
    PRIMARY KEY(id),
    UNIQUE (email)
);

CREATE TABLE pass (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(10),
    Date DATE
);

CREATE TABLE events (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100),
    fee INTEGER DEFAULT 0,
    password VARCHAR,
    pass_id VARCHAR(10),
    FOREIGN KEY (pass_id) REFERENCES pass(id)
);

CREATE TABLE users_events (
    event_id VARCHAR,
    user_email VARCHAR,
    is_present BOOLEAN DEFAULT false,
    paid BOOLEAN DEFAULT false,
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (user_email) REFERENCES users(email),
    PRIMARY KEY (event_id, user_email)
);

CREATE TABLE admin (
    uname VARCHAR(10) PRIMARY KEY,
    password VARCHAR
);
