import {neon, neonConfig} from "@neondatabase/serverless";
import {drizzle} from "drizzle-orm/neon-http";
// enable caching ->
neonConfig.fetchConnectionCache = true;

// if db url not found, throw error
if (!process.env.DATABASE_URL) {
    throw new Error('database url not found!')
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql);


