import * as dotenv from "dotenv";
// Load .env.local for standalone scripts and background tasks
dotenv.config({ path: ".env.local" });
dotenv.config();

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

// Global singleton declaration to preserve connection across Next.js dev hot-reloads
declare global {
  // eslint-disable-next-line no-var
  var _postgresClient: postgres.Sql | undefined;
}

let client: postgres.Sql;

if (!connectionString) {
  // Fallback for build time or before .env.local is configured
  client = postgres("postgresql://postgres:postgres@localhost:5432/postgres", { 
    max: 1,
    connect_timeout: 2
  });
} else {
  const poolOptions: postgres.Options<{}> = {
    max: 10,
    idle_timeout: 15,
    max_lifetime: 120, // Prevents stale/dead sockets from accumulating on Supabase pooler
    connect_timeout: 8,
    prepare: false, // Critical: Disables prepared statements for Supabase transaction pooler (port 6543)
  };

  if (process.env.NODE_ENV === "production") {
    client = postgres(connectionString, poolOptions);
  } else {
    if (!global._postgresClient) {
      global._postgresClient = postgres(connectionString, poolOptions);
    }
    client = global._postgresClient;
  }
}

export const db = drizzle(client, { schema });
export { client };
