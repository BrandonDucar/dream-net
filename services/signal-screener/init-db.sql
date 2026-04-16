-- Create signals database if it doesn't exist
CREATE DATABASE IF NOT EXISTS signals;

-- Switch to signals database
\c signals;

-- Run the schema
\i /app/schema.sql;
