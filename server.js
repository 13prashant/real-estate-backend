const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const morgan = require("morgan");
const colors = require("colors");
const errorHandler = require("./middlewares/error");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

// Import routes
const users = require("./routes/users");
// const builders = require("./routes/builders");
const projects = require("./routes/projects");
// const customers = require("./routes/customers");
// const brokers = require("./routes/brokers");

// Initialize express app
const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount routers
app.use("/api/v1/users", users);
// app.use("/api/v1/builders", builders);
app.use("/api/v1/projects", projects);
// app.use("/api/v1/customers", customers);
// app.use("/api/v1/brokers", brokers);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .bold
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
});
