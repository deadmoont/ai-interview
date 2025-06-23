/**@type {import ("drizzle-kit").Config} */
export default {
  dialect: "postgresql",
  schema: "./utils/schema.js",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_Vrg0SWihMe9H@ep-restless-salad-a1bvnd4g-pooler.ap-southeast-1.aws.neon.tech/ai-interview-mocker?sslmode=require",
  },
};
