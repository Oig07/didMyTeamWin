"use strict";

// Define API
const apiURL = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams";
const nflApiUrl="http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard";
// Function to fetch NFL teams
async function fetchNFLTeams() {
    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const teamList = document.getElementById('team-list');
        teamList.querySelectorAll('option:not([value=""])').forEach(option => option.remove());

        // Populate the dropdown with team options
        data.sports[0].leagues[0].teams.forEach(team => {
            const option = document.createElement('option');
            option.value = team.team.abbreviation;
            option.textContent = `${team.team.displayName} (${team.team.abbreviation})`;
            teamList.appendChild(option);
        });

        // Event listener for when a team is selected
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

    } catch (error){
    console.error('Error fetching NFL Teams:', error);
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
        const response = await fetch(nflApiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const gameList = document.getElementById('game-list');
        gameList.innerHTML = ''; // Clear any previous games

        // Find events that include the selected team
        const games = data.events.filter(event => {
            const teamNames = event.competitions[0].competitors.map(comp => comp.team.abbreviation);
            return teamNames.includes(teamAbbr);
        });

        // Fetch the team's shortDisplayName
        const selectedTeamShortName = await fetchTeamInfo(teamAbbr);

        // Check if the team is on a BYE week
        if (games.length === 0) {
            const byeItem = document.createElement('li');
            byeItem.textContent = `The ${selectedTeamShortName} are on a BYE week`;
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
fetchNFLTeams();
