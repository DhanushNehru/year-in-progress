const express = require("express");
const path = require("path");
const app = express();

// CRITICAL: Serve static files FIRST, before any routes
app.use(express.static(__dirname));

app.get("/year-progress", (req, res) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  var text;
  
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
        "Invalid start Date or end Date. Ensure the dates are in YYYY-MM-DD format and that startDate is before endDate."
      );
  }

  const startDateFormatted = start.toISOString().split("T")[0];
  const endDateFormatted = end.toISOString().split("T")[0];

  const isDefaultStartDate =
    start.getTime() === new Date(currentYear, 0, 1).getTime();
  const isDefaultEndDate =
    end.getTime() === new Date(currentYear + 1, 0, 1).getTime();

  const displayText =
    !isDefaultStartDate || !isDefaultEndDate
      ? `${startDateFormatted} to ${endDateFormatted}`
      : currentYear;
      
  const progress = ((now - start) / (end - start)) * 100;
  const progressFormatted = progress.toFixed(6);

  let backgroundColor = "#e0e0e0";
  let progressColor = "#3b82f6";
  let textColor = "#000";

  const theme = req.query.theme;
  if (theme === "dark") {
    backgroundColor = "#333";
    progressColor = "#1e90ff";
    textColor = "#fff";
  }
  
  function getDifferenceInHours(date1, date2) {
    const diffInMilliseconds = date2.getTime() - date1.getTime();
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
    return diffInHours;
  }
  
  if (progressFormatted < 0) {
    const difference = getDifferenceInHours(now, start);
    text = `Event yet to start - ${difference} Hours`;
  } else if (progressFormatted > 100) {
    const difference = getDifferenceInHours(end, now);
    text = `Event completed - ${difference} Hours`;
  } else {
    text = `${progressFormatted}% of ${displayText} Completed`;
  }
  
  const svg = `
    <svg width="300" height="50" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="50" fill="${backgroundColor}" />
      <rect width="${progressFormatted}%" height="50" fill="${progressColor}" />
      <text x="50%" y="30" alignment-baseline="middle" text-anchor="middle" fill="${textColor}" font-size="12">
        ${text}
      </text>
    </svg>
  `;

  res.setHeader("Content-Type", "image/svg+xml");
  res.send(svg);
});

// Homepage route - serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Year progress API running on port ${port}`)
);