import knex from "knex";
import dotenv from 'dotenv'
dotenv.config()

import {ConnectionInterface} from '../../types/consts'

const {PGHOST, PGPASSWORD, PGUSER, PGDATABASE} = process.env



export const db = knex({
    client: 'pg',
    connection:{
        host:PGHOST,
        user:PGUSER,
        password:PGPASSWORD,
        database:PGDATABASE,
        ssl: {
            require : true
        }
    } as ConnectionInterface
})