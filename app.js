const express = require("express");
const swaggerUI = require("swagger-ui-express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const swaggerSpec = require("./swagger");
const userRoute = require("./routes/user-route");

const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;
const dbUrl = process.env.DATABASE_URL;
const port = process.env.PORT;

mongoose
  .connect(`mongodb+srv://${username}:${password}@${dbUrl}/`)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) =>
    console.log(`Error in connecting the MongoDB: ${err?.message}`)
  );

const app = express();

var cors = require("cors");
app.use(cors());

app.use(express.json());

try {
  app.use("/user", userRoute);
} catch (error) {
  res.status(400).json({
    message: error.message,
    error: "Error while performing user operations",
  });
}

// Serve Swagger documentation
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.get(express.static(path.join(__dirname, "../client/build")));

app.get("/*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../client/build/index.html"),
    (err) => err ?? res.status(500).send(err)
  );
});

app.listen(port, () => {
  console.log(`basic-crud-api is listening on port ${port} ...`);
});
