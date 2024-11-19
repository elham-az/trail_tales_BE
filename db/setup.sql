DROP DATABASE IF EXISTS trail_tales__test;
DROP DATABASE IF EXISTS trail_tales;

CREATE DATABASE trail_tales_test;
CREATE DATABASE trail_tales;

\c trail_tales;
CREATE EXTENSION postgis;

\c trail_tales_test;
CREATE EXTENSION postgis;
