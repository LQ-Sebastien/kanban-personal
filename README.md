# Personal Kanban

I created as part of my training at O'Clock a personal Kanban

## How to make it work? Step by step :

- npm install in root folder with terminal
- Copy/paste '.env.exemple' with '.env' file name
- Go to data folder and type 'sudo -u -i postgres' in terminal 
- Once connected with the postgres user type 'psql' 
- Once connected in psql type '\i create_role_and_database.sql' and exit psql
- configure .env file
- type 'npm run db:reset' in the root folder with terminal
- type 'node index.js' in the root folder with terminal
- go to your favorite browser and type: localhost:3000