// Life expectancy data
const lifeExpectancyData = {
    0: { male: 74.12, female: 79.78 },
    10: { male: 74.67, female: 80.27 },
    20: { male: 74.97, female: 80.41 },
    30: { male: 75.86, female: 80.79 },
    40: { male: 76.97, female: 81.38 },
    50: { male: 78.33, female: 82.24 },
    60: { male: 80.47, female: 83.67 },
    70: { male: 83.59, female: 85.82 },
    80: { male: 87.74, female: 89.10 },
    90: { male: 93.72, female: 94.41 },
    100: { male: 101.93, female: 102.23 }
};

// Initialize charts
let charts = {
    reading: null,
    movie: null,
    concert: null,
    thanksgiving: null
};

// Constants
const MONTHS_PER_YEAR = 12;
const AVG_PAGES_PER_BOOK = 300;

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Initialize default values
    document.getElementById('currentAge').value = '30';
    document.getElementById('gender').value = 'male';
    
    // Add event listeners to all input fields
    document.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', function(e) {
            console.log('Input changed:', e.target.id, e.target.value);
            updateDashboard();
        });
        
        input.addEventListener('change', function(e) {
            console.log('Input changed:', e.target.id, e.target.value);
            updateDashboard();
        });
    });

    // Initialize charts
    initializeCharts();
    
    // Initial dashboard update
    console.log('Triggering initial dashboard update');
    setTimeout(updateDashboard, 100); // Small delay to ensure DOM is ready
});

function getLifeExpectancy(age, gender) {
    console.log('Calculating life expectancy for:', age, gender);
    
    // Find the closest age bracket
    const brackets = Object.keys(lifeExpectancyData).map(Number).sort((a, b) => a - b);
    
    // If age is beyond our last bracket, use the last bracket's data
    if (age >= brackets[brackets.length - 1]) {
        const lastBracket = brackets[brackets.length - 1];
        // Add a small increment for each year beyond the last bracket
        const yearsOverLastBracket = age - lastBracket;
        const increment = 0.5; // Add 6 months for each year over
        return lifeExpectancyData[lastBracket][gender] + (yearsOverLastBracket * increment);
    }
    
    // Find the two closest brackets for interpolation
    let lowerBracket = brackets[0];
    let upperBracket = brackets[1];
    
    for (let i = 0; i < brackets.length - 1; i++) {
        if (age >= brackets[i] && age < brackets[i + 1]) {
            lowerBracket = brackets[i];
            upperBracket = brackets[i + 1];
            break;
        }
    }
    
    // Calculate the interpolation factor
    const range = upperBracket - lowerBracket;
    const factor = (age - lowerBracket) / range;
    
    // Interpolate between the two brackets
    const lowerExpectancy = lifeExpectancyData[lowerBracket][gender];
    const upperExpectancy = lifeExpectancyData[upperBracket][gender];
    const expectancy = lowerExpectancy + (upperExpectancy - lowerExpectancy) * factor;
    
    // Ensure the expectancy is always at least current age plus 1
    const minExpectancy = age + 1;
    const finalExpectancy = Math.max(expectancy, minExpectancy);
    
    console.log('Calculated life expectancy:', finalExpectancy);
    return finalExpectancy;
}

function initializeCharts() {
    console.log('Initializing charts');
    const chartConfig = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    try {
        // Reading Chart
        const readingCtx = document.getElementById('readingChart');
        if (readingCtx) {
            charts.reading = new Chart(
                readingCtx.getContext('2d'),
                {
                    type: 'bar',
                    data: {
                        labels: ['Current', 'Goal', 'Lifetime Current', 'Lifetime Goal'],
                        datasets: [{
                            label: 'Books',
                            data: [0, 0, 0, 0],
                            backgroundColor: ['rgba(76, 110, 245, 0.5)', 'rgba(76, 110, 245, 0.8)', 'rgba(76, 110, 245, 0.5)', 'rgba(76, 110, 245, 0.8)']
                        }]
                    },
                    options: chartConfig
                }
            );
        } else {
            console.error('Reading chart canvas not found');
        }

        // Movie Chart
        const movieCtx = document.getElementById('movieChart');
        if (movieCtx) {
            charts.movie = new Chart(
                movieCtx.getContext('2d'),
                {
                    type: 'bar',
                    data: {
                        labels: ['Current', 'Goal', 'Lifetime Current', 'Lifetime Goal'],
                        datasets: [{
                            label: 'Movies',
                            data: [0, 0, 0, 0],
                            backgroundColor: ['rgba(76, 110, 245, 0.5)', 'rgba(76, 110, 245, 0.8)', 'rgba(76, 110, 245, 0.5)', 'rgba(76, 110, 245, 0.8)']
                        }]
                    },
                    options: chartConfig
                }
            );
        } else {
            console.error('Movie chart canvas not found');
        }

        // Concert Chart
        const concertCtx = document.getElementById('concertChart');
        if (concertCtx) {
            charts.concert = new Chart(
                concertCtx.getContext('2d'),
                {
                    type: 'bar',
                    data: {
                        labels: ['Current', 'Goal', 'Lifetime Current', 'Lifetime Goal'],
                        datasets: [{
                            label: 'Concerts',
                            data: [0, 0, 0, 0],
                            backgroundColor: ['rgba(76, 110, 245, 0.5)', 'rgba(76, 110, 245, 0.8)', 'rgba(76, 110, 245, 0.5)', 'rgba(76, 110, 245, 0.8)']
                        }]
                    },
                    options: chartConfig
                }
            );
        } else {
            console.error('Concert chart canvas not found');
        }

        // Thanksgiving Chart
        const thanksgivingCtx = document.getElementById('thanksgivingChart');
        if (thanksgivingCtx) {
            charts.thanksgiving = new Chart(
                thanksgivingCtx.getContext('2d'),
                {
                    type: 'bar',
                    data: {
                        labels: ['Remaining Thanksgivings'],
                        datasets: [{
                            label: 'Celebrations',
                            data: [0],
                            backgroundColor: ['rgba(76, 110, 245, 0.5)']
                        }]
                    },
                    options: chartConfig
                }
            );
        } else {
            console.error('Thanksgiving chart canvas not found');
        }
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

function updateDashboard() {
    console.log('Updating dashboard');
    
    // Get and validate inputs
    const ageInput = document.getElementById('currentAge');
    const genderInput = document.getElementById('gender');
    
    if (!ageInput || !genderInput) {
        console.error('Required input fields not found');
        return;
    }
    
    const currentAge = parseInt(ageInput.value) || 0;
    const gender = genderInput.value;
    
    console.log('Current age:', currentAge);
    console.log('Gender:', gender);
    
    // Update life expectancy
    const lifeExpectancy = getLifeExpectancy(currentAge, gender);
    console.log('Life expectancy:', lifeExpectancy);
    
    const yearsRemaining = Math.max(0, lifeExpectancy - currentAge);
    const currentYear = new Date().getFullYear();
    const projectedDeathYear = Math.round(currentYear + yearsRemaining);

    const lifeExpectancyInput = document.getElementById('lifeExpectancy');
    if (lifeExpectancyInput) {
        lifeExpectancyInput.value = lifeExpectancy;
        // Add the source link and death year projection after the input
        const lifeExpectancyContainer = lifeExpectancyInput.parentElement;
        const projectionDiv = document.createElement('div');
        projectionDiv.className = 'life-expectancy-info';
        projectionDiv.innerHTML = `
            <a href="https://www.perplexity.ai/search/average-life-expectancy-chart-wix98lEjQjC.0KulgpXIzA" target="_blank" class="source-link">(source)</a>
            <div class="death-year">Projected year: ${projectedDeathYear}</div>
        `;
        // Remove any existing projection div
        const existingProjection = lifeExpectancyContainer.querySelector('.life-expectancy-info');
        if (existingProjection) {
            existingProjection.remove();
        }
        lifeExpectancyContainer.appendChild(projectionDiv);
    }

    // Update timeline
    updateLifeTimeline(currentAge, lifeExpectancy);

    // Update all calculations
    updateReadingCalculations(currentAge, lifeExpectancy);
    updateMovieCalculations(currentAge, lifeExpectancy);
    updateConcertCalculations(currentAge, lifeExpectancy);
    updateThanksgivingCalculations(currentAge, lifeExpectancy);
    updateSuggestions();
}

function updateLifeTimeline(currentAge, lifeExpectancy) {
    const timeline = document.getElementById('lifeTimeline');
    timeline.innerHTML = '';

    const totalMonths = Math.floor(lifeExpectancy * 12);
    const livedMonths = Math.floor(currentAge * 12);

    for (let i = 0; i < totalMonths; i++) {
        const block = document.createElement('div');
        block.className = `timeline-block${i < livedMonths ? ' lived' : ''}`;
        timeline.appendChild(block);
    }
}

function createMetricRow(number, label, emoji, count = 1) {
    const emojis = Array(Math.min(count, 10)).fill(emoji).join(' ');
    return `
        <div class="metric-row">
            <div class="metric-number">${number}</div>
            <div class="metric-content">
                <div class="metric-label">${label}</div>
                <div class="emoji-container">${emojis}</div>
            </div>
        </div>
    `;
}

function updateReadingCalculations(currentAge, lifeExpectancy) {
    try {
        const readingSpeed = parseInt(document.getElementById('readingSpeed')?.value) || 30;
        const currentDailyTime = parseInt(document.getElementById('dailyReadingTime')?.value) || 30;
        const desiredDailyTime = parseInt(document.getElementById('desiredReadingTime')?.value) || 60;
        const daysPerWeek = parseInt(document.getElementById('readingDaysPerWeek')?.value) || 5;

        console.log('Reading inputs:', { readingSpeed, currentDailyTime, desiredDailyTime, daysPerWeek });

        const yearsRemaining = Math.max(0, lifeExpectancy - currentAge);
        const weeksPerYear = 52;

        // Calculate current reading rate
        const currentHoursPerYear = (currentDailyTime / 60) * daysPerWeek * weeksPerYear;
        const currentPagesPerYear = currentHoursPerYear * readingSpeed;
        const currentBooksPerYear = currentPagesPerYear / AVG_PAGES_PER_BOOK;

        // Calculate desired reading rate
        const desiredHoursPerYear = (desiredDailyTime / 60) * daysPerWeek * weeksPerYear;
        const desiredPagesPerYear = desiredHoursPerYear * readingSpeed;
        const desiredBooksPerYear = desiredPagesPerYear / AVG_PAGES_PER_BOOK;

        // Update reading stats
        const readingStats = document.getElementById('readingStats');
        if (readingStats) {
            readingStats.innerHTML = `
                ${createMetricRow(currentBooksPerYear.toFixed(1), 'Books per Year', '📚', Math.ceil(currentBooksPerYear/10))}
                ${createMetricRow(desiredBooksPerYear.toFixed(1), 'Goal Books per Year', '📖', Math.ceil(desiredBooksPerYear/10))}
                ${createMetricRow((desiredBooksPerYear * yearsRemaining).toFixed(0), 'Lifetime Potential', '⏱️')}
                <div class="calculation-note">*Lifetime potential shows the total books you could read if you maintain your goal pace for your remaining years</div>
            `;
        }

        // Update gap analysis
        const readingGap = document.getElementById('readingGap');
        if (readingGap) {
            const lifetimeGap = (desiredBooksPerYear - currentBooksPerYear) * yearsRemaining;
            readingGap.innerHTML = `
                <div class="milestone-marker">
                    <span>📈</span>
                    <span>Lifetime reading gap: ${Math.abs(lifetimeGap).toFixed(0)} books ${lifetimeGap > 0 ? 'below target' : 'above target'}</span>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error in reading calculations:', error);
    }
}

function updateMovieCalculations(currentAge, lifeExpectancy) {
    try {
        const currentMovies = parseFloat(document.getElementById('currentMovies')?.value) || 4;
        const desiredMovies = parseFloat(document.getElementById('desiredMovies')?.value) || 6;
        const yearsRemaining = Math.max(0, lifeExpectancy - currentAge);

        console.log('Movie inputs:', { currentMovies, desiredMovies, yearsRemaining });

        // Calculate lifetime numbers
        const currentLifetimeMovies = currentMovies * 12 * yearsRemaining;
        const desiredLifetimeMovies = desiredMovies * 12 * yearsRemaining;

        // Update movie stats
        const movieStats = document.getElementById('movieStats');
        if (movieStats) {
            movieStats.innerHTML = `
                ${createMetricRow(currentMovies.toFixed(1), 'Movies per Month', '🎬', Math.ceil(currentMovies))}
                ${createMetricRow(desiredMovies.toFixed(1), 'Goal Movies per Month', '🎥', Math.ceil(desiredMovies))}
                ${createMetricRow(desiredLifetimeMovies.toFixed(0), 'Lifetime Potential', '🍿')}
                <div class="calculation-note">*Lifetime potential shows the total movies you could watch if you maintain your goal pace for your remaining years</div>
            `;
        }

        // Update gap analysis
        const movieGap = document.getElementById('movieGap');
        if (movieGap) {
            const lifetimeGap = (desiredMovies - currentMovies) * 12 * yearsRemaining;
            movieGap.innerHTML = `
                <div class="milestone-marker">
                    <span>📈</span>
                    <span>Lifetime movie gap: ${Math.abs(lifetimeGap).toFixed(0)} movies ${lifetimeGap > 0 ? 'below target' : 'above target'}</span>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error in movie calculations:', error);
    }
}

function updateConcertCalculations(currentAge, lifeExpectancy) {
    try {
        const currentConcerts = parseFloat(document.getElementById('currentConcerts')?.value) || 1;
        const desiredConcerts = parseFloat(document.getElementById('desiredConcerts')?.value) || 2;
        const yearsRemaining = Math.max(0, lifeExpectancy - currentAge);

        console.log('Concert inputs:', { currentConcerts, desiredConcerts, yearsRemaining });

        // Calculate lifetime numbers
        const currentLifetimeConcerts = currentConcerts * 12 * yearsRemaining;
        const desiredLifetimeConcerts = desiredConcerts * 12 * yearsRemaining;

        // Update concert stats
        const concertStats = document.getElementById('concertStats');
        if (concertStats) {
            concertStats.innerHTML = `
                ${createMetricRow(currentConcerts.toFixed(1), 'Concerts per Month', '🎵', Math.ceil(currentConcerts))}
                ${createMetricRow(desiredConcerts.toFixed(1), 'Goal Concerts per Month', '🎸', Math.ceil(desiredConcerts))}
                ${createMetricRow(desiredLifetimeConcerts.toFixed(0), 'Lifetime Potential', '🎼')}
                <div class="calculation-note">*Lifetime potential shows the total concerts you could attend if you maintain your goal pace for your remaining years</div>
            `;
        }

        // Update gap analysis
        const concertGap = document.getElementById('concertGap');
        if (concertGap) {
            const lifetimeGap = Math.round((desiredConcerts - currentConcerts) * 12 * yearsRemaining);
            concertGap.innerHTML = `
                <div class="milestone-marker">
                    <span>📈</span>
                    <span>Lifetime concert gap: ${Math.abs(lifetimeGap)} concerts ${lifetimeGap > 0 ? 'below target' : 'above target'}</span>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error in concert calculations:', error);
    }
}

function updateThanksgivingCalculations(currentAge, lifeExpectancy) {
    try {
        const thanksgivingsPerYear = parseInt(document.getElementById('thanksgivingsPerYear')?.value) || 1;
        const yearsRemaining = Math.max(0, lifeExpectancy - currentAge);
        const remainingThanksgivings = thanksgivingsPerYear * yearsRemaining;

        console.log('Thanksgiving inputs:', { thanksgivingsPerYear, yearsRemaining });

        // Update thanksgiving stats
        const thanksgivingStats = document.getElementById('thanksgivingStats');
        if (thanksgivingStats) {
            thanksgivingStats.innerHTML = `
                ${createMetricRow(remainingThanksgivings.toFixed(0), 'Thanksgivings Remaining', '🦃', Math.min(5, thanksgivingsPerYear))}
                ${createMetricRow((remainingThanksgivings * 4).toFixed(0), 'Hours of Celebration', '🍽️')}
                <div class="calculation-note">*Hours calculated assuming 4 hours per Thanksgiving celebration</div>
            `;
        }
    } catch (error) {
        console.error('Error in thanksgiving calculations:', error);
    }
}

function updateSuggestions() {
    try {
        const suggestions = document.getElementById('suggestions');
        if (!suggestions) {
            console.error('Suggestions element not found');
            return;
        }

        let suggestionsHTML = '';

        // Reading suggestions
        const readingTimeGap = parseInt(document.getElementById('desiredReadingTime')?.value || 0) - 
                             parseInt(document.getElementById('dailyReadingTime')?.value || 0);
        
        if (readingTimeGap > 0) {
            suggestionsHTML += `
                <div class="suggestion-item">
                    📚 To reach your reading goal, try to add ${readingTimeGap} minutes of reading time each day.
                    Some tips:
                    • Read during your commute
                    • Replace 15 minutes of social media with reading
                    • Keep a book by your bedside
                </div>
            `;
        }

        // Movie suggestions
        const movieGap = parseFloat(document.getElementById('desiredMovies')?.value || 0) - 
                        parseFloat(document.getElementById('currentMovies')?.value || 0);
        
        if (movieGap > 0) {
            suggestionsHTML += `
                <div class="suggestion-item">
                    🎬 To reach your movie-watching goal, watch ${movieGap.toFixed(1)} more movies per month.
                    Some tips:
                    • Schedule a weekly movie night
                    • Join a movie club
                    • Create a watchlist of must-see films
                </div>
            `;
        }

        // Concert suggestions
        const concertGap = parseFloat(document.getElementById('desiredConcerts')?.value || 0) - 
                          parseFloat(document.getElementById('currentConcerts')?.value || 0);
        
        if (concertGap > 0) {
            suggestionsHTML += `
                <div class="suggestion-item">
                    🎵 To reach your concert goal, attend ${concertGap.toFixed(1)} more concerts per month.
                    Some tips:
                    • Follow your favorite artists on social media
                    • Set up price alerts for tickets
                    • Join local music groups
                </div>
            `;
        }

        // Update suggestions
        suggestions.innerHTML = suggestionsHTML || `
            <div class="suggestion-item">
                ✨ You're on track with all your goals! Keep up the great work!
                Some tips to maintain your momentum:
                • Track your progress regularly
                • Set new challenges when you're ready
                • Share your achievements with friends
            </div>
        `;

    } catch (error) {
        console.error('Error updating suggestions:', error);
        const suggestions = document.getElementById('suggestions');
        if (suggestions) {
            suggestions.innerHTML = `
                <div class="suggestion-item">
                    ⚠️ There was an error generating suggestions. Please make sure all your goals are properly set.
                </div>
            `;
        }
    }
}
