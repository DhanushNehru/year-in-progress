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

function updateTheme(isAutomatic = false) {
  if (isAutomatic) {
    const isDay = isDayTime();
    body.classList.toggle("dark-mode", !isDay);
    themeToggleButton.innerHTML = isDay
      ? '<i class="fa-solid fa-moon theme-icon"></i>'
      : '<i class="fa-solid fa-sun theme-icon"></i>';
  } else {
    body.classList.toggle("dark-mode");
    themeToggleButton.innerHTML = body.classList.contains("dark-mode")
      ? '<i class="fa-solid fa-sun theme-icon"></i>'
      : '<i class="fa-solid fa-moon theme-icon"></i>';
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

setInterval(updateProgressImg, 500);

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
