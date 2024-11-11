"use strict";

// Function to fetch NFL teams
import { fetchNFLTeams, fetchTeamInfo } from './fetchNFLTeams.js';
import { populateTeamList, displayTeamLogo } from './fetchNFLTeamsDOMUtils.js';
import { fetchScoreboard } from './nflScoreboard.js';

const apiURL = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams";
const nflApiUrl="http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard";

async function initializeNFLTeams() {
    try {
        const data = await fetchNFLTeams(apiURL);
        console.log(data);

        const teamList = document.getElementById('team-list');
        const teams = data.sports[0].leagues[0].teams;

        populateTeamList(teamList, teams);

        teamList.addEventListener('change', async function () {
            const selectedTeam = teams.find(t => t.team.abbreviation === this.value);
            if (selectedTeam) {
                const logoUrl = selectedTeam.team.logos.length > 0 ? selectedTeam.team.logos[0].href : '';
                displayTeamLogo(logoUrl);

                await fetchScoreboard(nflApiUrl,selectedTeam.team.abbreviation); // Ensure fetchScoreboard is imported or defined
            }
        });
    } catch (error) {
        console.error('Error initializing NFL Teams:', error);
    }
}

// Example usage of fetchTeamInfo:
async function displayTeamInfo(teamAbbr) {
    try {
        const teamName = await fetchTeamInfo(apiURL, teamAbbr);
        console.log(`Team name for ${teamAbbr}: ${teamName}`);
    } catch (error) {
        console.error('Error displaying team information:', error);
    }
}
displayTeamInfo();
initializeNFLTeams();