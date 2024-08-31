import { defineConfig } from "drizzle-kit";
 
export default defineConfig({
  schema: "./configs/schema.js",
  out: "./drizzle",
  dialect: 'postgresql',
  dbCredentials: {
    url:'postgresql://neondb_owner:3VRUchdPXq7a@ep-falling-rice-a5gfro1n.us-east-2.aws.neon.tech/neondb?sslmode=require' ,
  }
});