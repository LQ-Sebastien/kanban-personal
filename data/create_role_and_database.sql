BEGIN TRANSACTION;

CREATE ROLE okanban WITH LOGIN PASSWORD 'okanban';
COMMIT TRANSACTION;

CREATE DATABASE okanban OWNER okanban;
