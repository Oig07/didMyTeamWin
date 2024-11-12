"use strict";

// Function to fetch NFL teams
import { fetchNFLTeams} from './fetchNFLTeams.js';
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

                await fetchScoreboard(nflApiUrl,selectedTeam.team.abbreviation);
            }
        });
    } catch (error) {
        console.error('Error initializing NFL Teams:', error);
    }
}
initializeNFLTeams();