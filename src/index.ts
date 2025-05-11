import express from "express";
import cors from "cors";
import authRouters from "./routes/auth/auth.routes";
import skillRouters from "./routes/auth/skill.routes";
import { dataSource } from "./config/db";
import { User } from "./entities/user.entity";

const app = express();
const PORT = 3300;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.get("/", (_req, res) => {
  res.send({message:"success"});
});

app.use("/auth", authRouters);
app.use("/skill", skillRouters);

dataSource.getRepository(User);

dataSource
  .initialize()
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to database", err);
  });
