"use strict";

export function populateTeamList(teamList, teams) {
    // Clear existing options except for the default one
    teamList.querySelectorAll('option:not([value=""])').forEach(option => option.remove());

    teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team.team.abbreviation;
        option.textContent = `${team.team.displayName} (${team.team.abbreviation})`;
        teamList.appendChild(option);
    });
}

export function displayTeamLogo(logoUrl) {
    const logoImg = document.getElementById('team-logo');
    logoImg.src = logoUrl;
    logoImg.style.display = 'flex';
}