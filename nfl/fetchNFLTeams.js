"use strict";
//Find Team Info
export async function fetchNFLTeams(nflApiURL) {
    try {
        const response = await fetch(nflApiURL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching NFL Teams:', error);
        throw error; // Re-throw for handling in main code
    }
}

export async function fetchTeamInfo(apiURL, teamAbbr) {
    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if(data.teams){
            const team = data.teams.find(t => t.team.abbreviation === teamAbbr);
            return team ? team.team.shortDisplayName : teamAbbr; // Return short name or abbreviation if not found
        }
    } catch (error) {
        console.error('Error fetching team information:', error);
        return teamAbbr; // Fallback to abbreviation if there's an error
    }
}