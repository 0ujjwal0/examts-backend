const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./modal/config/db");
const userRoutes = require("./routes/userRoutes");
const testRoutes = require("./routes/testroutes");
const questionRoutes = require("./routes/questionRoutes");
const submissionRoutes = require("./routes/submissionroutes");
const swaggerDocument = require("./api-doc.json");
const swaggerUi = require("swagger-ui-express");

const app = express();
dotenv.config();
connectDB();
app.use(
  cors({
    origin: ["http://localhost", "http://localhost:3000"], //https://examly-lovat.vercel.app
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/tests", testRoutes);
app.use("/api/user", userRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/submission", submissionRoutes);

require("./cron/cron");

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`server started on port ${PORT}`));
