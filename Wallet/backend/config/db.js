import {neon} from "@neondatabase/serverless";
import "dotenv/config";

export const sql = neon(process.env.DATABASE_URL, { timeout: 10000 });