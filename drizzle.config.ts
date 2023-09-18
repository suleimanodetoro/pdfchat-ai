// config file on how drizzle should know where our schema is stored

import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

// The driver is postgres, and then schema...
export default {
  driver: "pg",
  schema: "./lib/db/schema.ts",
  dbCredentials: {
    // Because it's possible we might not have access to process.env in this directory, install dotenv package (npm install dotenv) and use it to pull the value you need
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;

// we can eventually run this command ot make sure our neon db is synced up with schema: npx drizzle-kit push:pg
