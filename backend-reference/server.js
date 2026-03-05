const express = require("express");
const cors = require("cors");
require("dotenv").config();

const supervisorRoutes = require("./routes/supervisorRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/supervisors", supervisorRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
