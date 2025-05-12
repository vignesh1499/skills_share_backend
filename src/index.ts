import express from "express";
import cors from "cors";
import authRouters from "./routes/auth.routes";
import skillRouters from "./routes/skill.routes";
import tasksRouters from "./routes/tasks.routes";
import { dataSource } from "./config/db";
import { User } from "./entities/user.entity";

// Swagger imports
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// App setup
const app = express();
const PORT = 3300;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

// Health check route
app.get("/", (_req, res) => {
  res.send({ message: "API is up and running!" });
});

// Register routes
app.use("/auth", authRouters);
app.use("/skill", skillRouters);
app.use("/tasks", tasksRouters);

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Skill_Share API',
      version: '1.0.0',
      description: 'Skill_Share API Documentation',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
console.log(`Swagger docs - ttp://localhost:${PORT}/api-docs`);

// Database init & server start
dataSource.initialize()
  .then(() => {
    console.log("Database connected successfully");
    dataSource.getRepository(User);

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });
