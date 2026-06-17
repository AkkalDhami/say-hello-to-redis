import app from "./app";
import { connectDB } from "./configss/db";
import env from "./configss/env";

connectDB()
.then(() => {
  app.listen(env.PORT, () => {
    console.log(
      `[server]: Server is running at http://localhost:${env.PORT}`
    );
  });
})
.catch((error) => {
  console.error("MongoDB Connection Failed:", error);
  process.exit(1);
});