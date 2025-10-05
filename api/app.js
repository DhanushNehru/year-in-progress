const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/year-progress", (req, res) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  let text;

  const startDateParam = req.query.startDate;
  const endDateParam = req.query.endDate;

  let start = startDateParam
    ? new Date(startDateParam)
    : new Date(now.getFullYear(), 0, 1);
  let end = endDateParam
    ? new Date(endDateParam)
    : new Date(now.getFullYear() + 1, 0, 1);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
    return res
      .status(400)
      .send(
        "Invalid startDate or endDate. Use YYYY-MM-DD and ensure startDate < endDate."
      );
  }

  const progress = ((now - start) / (end - start)) * 100;
  const progressFormatted = progress.toFixed(6);
  const displayText = currentYear;

  const svg = `
    <svg width="300" height="50" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="50" fill="#e0e0e0" />
      <rect width="${progressFormatted}%" height="50" fill="#3b82f6" />
      <text x="50%" y="30" alignment-baseline="middle" text-anchor="middle" fill="#000" font-size="12">
        ${progressFormatted}% of ${displayText} Completed
      </text>
    </svg>
  `;

  res.setHeader("Content-Type", "image/svg+xml");
  res.send(svg);
});

// Serve index.html for root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
