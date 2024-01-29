# Web Authentication API

A simple implementation of an app that uses Passkeys for authentication:

- The implementation was done **inside** a docker container (for practice reasons) -> This gives the option NOT to install anything directly on the user computer and leave everything inside the docker container
- The app will allow registration and authentication of users via public keys instead of password
- The server is implemented with Express.js

Tools:

1. **SEQUELIZE** - ORM as a layer between the server application and the database
2. **POSTGRES** - Database, inside the docker container
3. **PgAdmin** - UI tool for pg database, inside the docker container
