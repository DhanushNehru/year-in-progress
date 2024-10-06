const themeToggleButton = document.getElementById('theme-toggle');
const body = document.body;

// Function to determine if it's daytime (8 AM to 5 PM)
function isDayTime() {
    const now = new Date();
    const hours = now.getHours();
    return hours >= 8 && hours < 17;
}

// Function to update theme based on time or user toggle
function updateTheme(isAutomatic = false) {
    // If automatic and it's daytime, use light mode, otherwise use dark mode
    if (isAutomatic) {
        const isDay = isDayTime();
        body.classList.toggle('dark-mode', !isDay);
        themeToggleButton.textContent = isDay ? 'Switch to Dark Mode' : 'Switch to Light Mode';
    } else {
        // Manual toggle by user
        body.classList.toggle('dark-mode');
        themeToggleButton.textContent = body.classList.contains('dark-mode') ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    }
    updateProgressImg();
}

// Update progress image based on current theme (light/dark)
function updateProgressImg() {
    const theme = body.classList.contains('dark-mode') ? 'dark' : 'light';
    document.getElementById('progress-img').src = `https://year-in-progress.vercel.app/year-progress?time=${Date.now()}&theme=${theme}`;
}

// Automatically set the theme based on the user's local time when the page loads
window.addEventListener('load', () => {
    updateTheme(true);  // Pass true to indicate it's an automatic theme setting
});

// Allow the user to manually toggle the theme
themeToggleButton.addEventListener('click', () => updateTheme(false));

// Update the progress image every second
setInterval(updateProgressImg, 1000);
