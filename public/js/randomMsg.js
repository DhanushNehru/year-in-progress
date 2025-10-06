// Get and display a random funny fact
function showRandomFact() {
    // Get random fact from the Useless Facts API
    fetch('https://uselessfacts.jsph.pl/random.json?language=en')
        .then(response => response.json())
        .then(data => {
            // Check if the fact is more than 150 characters
            if (data.text.length > 150) {
                // If it's too long, fetch another fact
                console.log('Fact is too long, fetching another one...');
                showRandomFact(); // Recursively call to fetch a new fact
            } else {
                // Otherwise, display the fact
                document.getElementById('random-msg').textContent = data.text;
            }
        })
        .catch(error => console.error('Error fetching the fact:', error));

    // Get a new fact every 5 mins
    setTimeout(showRandomFact, 300000);
}

// Get a quote on page load
window.onload = showRandomFact;
