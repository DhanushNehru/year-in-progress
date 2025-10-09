// Theme management functionality
const themeToggleButton = document.getElementById("theme-toggle");
const githubIcon = document.querySelector(".github-icon");
const body = document.body;
var queryString;

function isDayTime() {
  const now = new Date();
  const hours = now.getHours();
  return hours >= 8 && hours < 17;
}

// Helper function to safely update theme icon
function updateThemeIcon(iconType) {
  const iconElement = themeToggleButton.querySelector('.theme-icon');
  if (iconElement) {
    iconElement.className = `fa-solid fa-${iconType} theme-icon`;
  } else {
    // Fallback: create new icon element if none exists
    const newIcon = document.createElement('i');
    newIcon.className = `fa-solid fa-${iconType} theme-icon`;
    themeToggleButton.innerHTML = '';
    themeToggleButton.appendChild(newIcon);
  }
}

function updateTheme(isAutomatic = false) {
  if (isAutomatic) {
    const isDay = isDayTime();
    body.classList.toggle("dark-mode", !isDay);
    updateThemeIcon(isDay ? "moon" : "sun");
  } else {
    body.classList.toggle("dark-mode");
    const isDarkMode = body.classList.contains("dark-mode");
    updateThemeIcon(isDarkMode ? "sun" : "moon");
  }
  updateProgressImg();
  updateGitHubIcon();
}

function updateProgressImg() {
  const theme = body.classList.contains("dark-mode") ? "dark" : "light";
  if (queryString) {
    document.getElementById(
      "progress-img"
    ).src = `https://year-in-progress.vercel.app/year-progress?${queryString}&time=${Date.now()}&theme=${theme}`;
  } else {
    document.getElementById(
      "progress-img"
    ).src = `https://year-in-progress.vercel.app/year-progress?time=${Date.now()}&theme=${theme}`;
  }
}

function updateGitHubIcon() {
  if (body.classList.contains("dark-mode")) {
    githubIcon.classList.add("invert");
  } else {
    githubIcon.classList.remove("invert");
  }
}

// Event listeners
window.addEventListener("load", () => {
  updateTheme(true);
});

themeToggleButton.addEventListener("click", () => updateTheme(false));

// Reduced frequency for better performance - update every 5 seconds instead of 500ms
setInterval(updateProgressImg, 5000);

// Date change functionality
function changeDate() {
  var startDate = new Date(document.getElementById("startDate").value);
  var endDate = new Date(document.getElementById("endDate").value);
  if (endDate < startDate) {
    alert("Please enter valid Date");
    return;
  }
  if (startDate.toDateString() == endDate.toDateString()) {
    endDate.setDate(endDate.getDate() + 1);
  }
  startDate = startDate.toISOString();
  endDate = endDate.toISOString();
  queryString = `startDate=${startDate}&endDate=${endDate}`;
  document.getElementById(
    "progress-img"
  ).src = `https://year-in-progress.vercel.app/year-progress?${queryString}`;
}

// Current year functionality
document.getElementById("current-year").textContent = new Date().getFullYear();
