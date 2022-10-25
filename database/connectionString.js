const pgp = require('pg-promise')();

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:Jnisto9801@localhost:5432/waiters_app"
const config ={  
    connectionString : DATABASE_URL
}
if(process.env.NODE_ENV == 'production'){
    config.ssl ={
        rejectUnauthorized: false
    }
}


const db = pgp(config);
module.exports = db;

