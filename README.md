# HR Frontend

The HR tool build by Didux.io.

# Installation

To run this application you need to have npm installed.

## Copy example configuration
```cp src/assets/config/config.example.ts src/assets/config/config.ts```

## Running the application

Install modules
```npm i```

Start database 
```docker run --name DB_HOST --rm -h DB_HOST -e POSTGRES_PASSWORD=DB_PASSWORD -e POSTGRES_USER=DB_USER -e POSTGRES_DB=DB_NAME -p 5432:5432 -d postgres:9.6```

Run the application:

```npm run start```

## Pull changes from Boilerplate

```
git remote add public git@github.com:didux-io/Boilerplate-Backend.git
git pull public main # Creates a merge commit
git push origin main
```
