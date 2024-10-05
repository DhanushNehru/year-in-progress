const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, '/')));


app.get('/year-progress', (req, res) => {
    const now = new Date();
    const currentYear = now.getFullYear();

    // Check if custom date range is provided
    const startDateParam = req.query.startDate;
    const endDateParam = req.query.endDate;

    // Parse the provided dates, or default to the current year
    let start = startDateParam ? new Date(startDateParam) : new Date(now.getFullYear(), 0, 1);
    let end = endDateParam ? new Date(endDateParam) : new Date(now.getFullYear() + 1, 0, 1);

    // Validate that start date is before end date
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
        return res.status(400).send('Invalid start Date or end Date. Ensure the dates are in YYYY-MM-DD format and that startDate is before endDate.');
    }

    // Format the dates to ISO strings for display
    const startDateFormatted = start.toISOString().split('T')[0];
    const endDateFormatted = end.toISOString().split('T')[0];

    // Compare the start and end dates with the default current year range
    const isDefaultStartDate = start.getTime() === new Date(currentYear, 0, 1).getTime();
    const isDefaultEndDate = end.getTime() === new Date(currentYear + 1, 0, 1).getTime();

    // Display either the current year or the custom date range
    const displayText = (!isDefaultStartDate || !isDefaultEndDate) 
        ? `${startDateFormatted} to ${endDateFormatted}` 
        : currentYear;
    
    // Calculate progress within the date range
    const progress = ((now - start) / (end - start)) * 100;
    const progressFormatted = progress.toFixed(6);
    
    // Default colors
    let backgroundColor = '#e0e0e0'; // light gray
    let progressColor = '#3b82f6'; // blue
    let textColor = '#000'; // black

    // Check for theme query parameter
    const theme = req.query.theme;
    if (theme === 'dark') {
        backgroundColor = '#333'; // dark gray
        progressColor = '#1e90ff'; // lighter blue
        textColor = '#fff'; // white
    }

    const svg = `
        <svg width="300" height="50" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="50" fill="${backgroundColor}" />
            <rect width="${progressFormatted}%" height="50" fill="${progressColor}" />
            <text x="50%" y="30" alignment-baseline="middle" text-anchor="middle" fill="${textColor}" font-size="12">
                ${progressFormatted}% of ${displayText} Completed
            </text>
        </svg>
    `;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
});


// Serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Year progress API running on port ${port}`));