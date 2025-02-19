--
-- PostgreSQL database cluster dump
--

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE "'postgres'";
ALTER ROLE "'postgres'" WITH NOSUPERUSER INHERIT NOCREATEROLE CREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:LI/oEMm2h8RZeSRK6pNeUA==$XEuMMtZVXbmeq9MZ7tqOY3roPl8xvSBvOSM/h4oU8dM=:n0LuLJGozaKa6aS+YtYTGxZLSCC6sB6/dO92Cfq5M+Q=';
CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:P+yGkWui5xnwi9Wn5GP9Dw==$13oTCjaHsUT6C4/MR0GkY7m16WwgkLZTV+KYwMJ0bpk=:LC9soPP+FuPT/r2yuLrZpjzaswfHcn/lV0OC2Xa0dZw=';

--
-- User Configurations
--






--
-- PostgreSQL database cluster dump complete
--

