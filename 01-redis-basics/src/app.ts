import express from "express";

import userRoutes from "./routes/user.routes";
import { rateLimiter } from "./middlewares/rate-limiter";

const app = express();

app.use(express.json());

app.use(
  rateLimiter({
    limit: 5,
    strategy: "fixedWindow"
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/users", userRoutes);

export default app;
