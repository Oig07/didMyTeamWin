"uses strict";

// Define API
const apiURL = "https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/teams";
const nhlApiUrl="http://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard"

// Function to fetch NHL teams
async function fetchNHLTeams(){
    try{
        const response = await fetch(apiURL);
        // Check if response is ok
        if (!response.ok){
            throw new Error (`HTTP error! Status: ${response.status}`)
        }
        // Parse JSON Response
        const data = await response.json()
        console.log(data);
        // Get the team list element
        const teamList = document.getElementById('team-list');

        // Clear dynamically loaded options
        teamList.querySelectorAll('option:not([value=""])').forEach(option=>option.remove());

        // Loop throughteams and create Option items
        data.sports[0].leagues[0].teams.forEach(team=>{
            const option = document.createElement('option');
            option.value=team.team.abbreviation;
            option.textContent = `${team.team.displayName} (${team.team.abbreviation})`;
            teamList.appendChild(option); // Add option to select
        });

        teamList.addEventListener('change', async function () {
            const selectedTeam = data.sports[0].leagues[0].teams.find(t => t.team.abbreviation === this.value);
            if (selectedTeam) {
                const logoUrl = selectedTeam.team.logos.length > 0 ? selectedTeam.team.logos[0].href : '';
                const logoImg = document.getElementById('team-logo');
                logoImg.src = logoUrl;
                logoImg.style.display = 'flex';
        
                // Fetch scoreboard data and display games for the selected team
                await fetchScoreboard(selectedTeam.team.abbreviation);
            }
        });
    } catch(error){
        console.error('Error fetching NHL Teams:', error);
}
}
async function fetchTeamInfo(teamAbbr) {
    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // Find the team with the matching abbreviation
        const team = data.sports[0].leagues[0].teams.find(t => t.team.abbreviation === teamAbbr);
        return team ? team.team.shortDisplayName : teamAbbr; // Return short name or abbreviation if not found
    } catch (error) {
        console.error('Error fetching team information:', error);
        return teamAbbr; // Fallback to abbreviation if there's an error
    }
}

async function fetchScoreboard(teamAbbr) {
    try {
        const response = await fetch(nhlApiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data)
        const gameList = document.getElementById('game-list');
        gameList.innerHTML = ''; // Clear any previous games

        // Find events that include the selected team
        const games = data.events.filter(event => {
            const teamNames = event.competitions[0].competitors.map(comp => comp.team.abbreviation);
            return teamNames.includes(teamAbbr);
        });

        // Fetch the team's shortDisplayName
        const selectedTeamShortName = await fetchTeamInfo(teamAbbr);

        // Check if the team is OFF
        if (games.length === 0) {
            const byeItem = document.createElement('li');
            byeItem.textContent = `The ${selectedTeamShortName} do not play today.`;
            gameList.appendChild(byeItem);
            return; // Exit early since the team has no games this week
        }

        // Display the game details and check if the selected team won
        games.forEach(game => {
            const gameItem = document.createElement('li');
            const homeCompetitor = game.competitions[0].competitors.find(comp => comp.homeAway === 'home');
            const awayCompetitor = game.competitions[0].competitors.find(comp => comp.homeAway === 'away');

            const selectedTeamCompetitor = homeCompetitor.team.abbreviation === teamAbbr ? homeCompetitor : awayCompetitor;
            const opponentCompetitor = selectedTeamCompetitor === homeCompetitor ? awayCompetitor : homeCompetitor;

            const selectedTeamScore = parseInt(selectedTeamCompetitor.score, 10);
            const opponentScore = parseInt(opponentCompetitor.score, 10);

            //Format Time
            function parseTimeInEST(dateString) {
                // Parse the date string into a JavaScript Date object
                const date = new Date(dateString);
            
                // Create options to only format the time part in EST
                const options = {
                    timeZone: 'America/New_York',  // Timezone for EST (or EDT depending on the time of year)
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true // 12-hour format with AM/PM
                };
            
                // Format the time part to EST using toLocaleTimeString
                const estTime = date.toLocaleTimeString('en-US', options);
                return estTime;
            }

            function getOrdinalPeriod(period){
                switch(period){
                    case 1: return "1st";
                    case 2: return "2nd";
                    case 3: return "3rd";
                    case 4: return "4th";
                    default: return `${period}th`
                }
            }

            const gameStatus = game.status.type.description;
            const gamePeriod = game.status.period;
            const gameOrdinalPeriod = getOrdinalPeriod(gamePeriod);
            const gameClock = game.status.displayClock;

            if (gameStatus === "Scheduled") {
                const gameDate = parseTimeInEST(game.date);
                gameItem.innerHTML = `The ${selectedTeamShortName} are scheduled to play against the ${opponentCompetitor.team.shortDisplayName} today at ${gameDate} EST.`;
            } else if (gameStatus === "In Progress") {
                // Display a message for ongoing games
                gameItem.innerHTML = `The ${selectedTeamShortName} are currently playing against the ${opponentCompetitor.team.shortDisplayName}. There is ${gameClock} left in the ${gameOrdinalPeriod} Period. <br>Current Score: ${selectedTeamShortName} (${selectedTeamScore}) - ${opponentCompetitor.team.shortDisplayName} (${opponentScore}).`;

            } else if (gameStatus === "End of Period"){
                // Display a message when games are inbetween periods
                gameItem.innerHTML = `It is the end of the ${gameOrdinalPeriod} Period. The ${selectedTeamShortName} are currently playing against the ${opponentCompetitor.team.shortDisplayName}. <br>Current Score: ${selectedTeamShortName} (${selectedTeamScore}) - ${opponentCompetitor.team.shortDisplayName} (${opponentScore}). `

            } else {
                let resultText = "";
                if (selectedTeamScore > opponentScore) {
                    resultText = `The ${selectedTeamCompetitor.team.shortDisplayName} won against the ${opponentCompetitor.team.shortDisplayName}! Final Score: `;
                } else if (selectedTeamScore < opponentScore) {
                    resultText = `The ${selectedTeamCompetitor.team.shortDisplayName} lost to the ${opponentCompetitor.team.shortDisplayName}! Final Score: `;
                } else {
                    resultText = `The ${selectedTeamCompetitor.team.shortDisplayName} tied with the ${opponentCompetitor.team.shortDisplayName}! Final Score: `;
                }
                gameItem.textContent = `${resultText} (${selectedTeamScore} - ${opponentScore})`;
            }
            gameList.appendChild(gameItem);
        });

    } catch (error) {
        console.error('Error fetching scoreboard:', error);
    }
}
fetchNHLTeams();