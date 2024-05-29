import knex from "knex";
import dotenv from 'dotenv'
dotenv.config()

import {ConnectionInterface} from '../../consts'

const {PGHOST, PGPASSWORD, PGUSER, PGDATABASE, PGPORT} = process.env

export const db = knex({
    client: 'pg',
    connection:{
        host:PGHOST,
        port:PGPORT,
        user:PGUSER,
        password:PGPASSWORD,
        database:PGDATABASE
    } as ConnectionInterface
})