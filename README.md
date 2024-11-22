# trail_tales_fb_BE

#### You will need to create the necessary environment variables to run it locally:
1. Create a file named .env.test in the root directory of the project to configure your testing database.
2. In the .env.test file, declare the variable PGDATABASE=trail_tales_test
3. Similarly, create a file named .env.development in the root directory for your development database.
4. In the development file, specify PGDATABASE=trail_tales.
#### To set up the project, execute the following commands in your terminal:
1. npm i - to install all necessary dependencies.
2. npm run setup-dbs - this will set up the database.
3. npm seed - to seed the database.
4. npm test - to run the tests.
#### To successfully run the project, ensure you have the following:
1. Node.js - recommended minimum version 14.x.
2. PostgreSQL - recommended minimum version 12.x.
3. Postgis : 
sudo apt update
sudo apt install postgis postgresql-postgis