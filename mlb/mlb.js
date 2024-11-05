"uses strict";

// Define API
const apiURL = "https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/teams";
const mlbApiUrl="http://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard";

// Function to fetch NBA teams
async function fetchMLBTeams(){
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
        console.error('Error fetching NBA Teams:', error);
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
        const response = await fetch(mlbApiUrl);
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

            // Check if Game Status = Scheduled
        if(data.events[0].status.type.description === "Scheduled"){
            const scheduleItem = document.createElement('li');
            const gameDate = parseTimeInEST(data.events[0].date)
            scheduleItem.textContent = `The ${selectedTeamShortName} are scheduled to play against the ${opponentCompetitor.team.shortDisplayName} today at ${gameDate} EST.`
            gameList.appendChild(scheduleItem);
            return;
        }

            // Determine the game result text
            let resultText = "";
            if (selectedTeamScore > opponentScore) {
                resultText = `The ${selectedTeamCompetitor.team.shortDisplayName} win over the ${opponentCompetitor.team.shortDisplayName}! Final Score: `;
            } else if (selectedTeamScore < opponentScore) {
                resultText = `The ${selectedTeamCompetitor.team.shortDisplayName} lose to the ${opponentCompetitor.team.shortDisplayName}! Final Score: `;
            } else {
                resultText = `The ${selectedTeamCompetitor.team.shortDisplayName} tie with the ${opponentCompetitor.team.shortDisplayName}! Final Score: `;
            }

            gameItem.textContent = `${resultText} (${selectedTeamScore} - ${opponentScore})`;
            gameList.appendChild(gameItem);
        });

    } catch (error) {
        console.error('Error fetching scoreboard:', error);
    }
}
fetchMLBTeams();