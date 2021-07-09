const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const { notFound, errorHandler } = require("./middleware/errorMiddleware.js");
const bodyParser = require("body-parser");
const productRoutes = require("./routes/productRoute.js");
const categoryRoutes = require("./routes/categoryRoute.js");
const auth = require("./middleware/authMiddleware.js");
const { serverLog, errorLog } = require("./middleware/logMiddleware.js");

dotenv.config();

connectDB();

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(bodyParser.json());

//app.use(auth);

app.get("/", (req, res) => {
  res.send("API is running");
});

//app.use(serverLog);

app.use("/api/products", productRoutes);

app.use("/api/categories", categoryRoutes);

//app.use(errorLog);
app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

module.exports = app;
