require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 4000;

// const path = require("path");
// const fs = require("fs");

require("./conn");

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

const UserRoutes = require("./Routes/user");
const ResumeRoutes = require("./Routes/resume");

app.use("/api/user", UserRoutes);
app.use("/api/resume", ResumeRoutes);
app.get("/api/health", (req, res) => {
  res.status(200).json({ ok: true });
});


// const frontendDistPath = path.join(__dirname, "../mern_ai/dist");
// const fallbackBuildPath = path.join(__dirname, "build");
// const staticPath = fs.existsSync(frontendDistPath) ? frontendDistPath : fallbackBuildPath;

// app.use(express.static(staticPath));

// SPA fallback for non-API routes
// app.use((req, res) => {
//   res.sendFile(path.join(staticPath, "index.html"));
// });

app.listen(PORT, () => {
  console.log("backend is running on port", PORT);
});
