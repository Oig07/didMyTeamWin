"uses strict";

// Define API
const apiURL = "https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/teams";

// Function to fetch NBA teams
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

        teamList.addEventListener('change', function(){
            const selectedTeam = data.sports[0].leagues[0].teams.find(t => t.team.abbreviation === this.value);
            const logoUrl = selectedTeam.team.logos.length > 0 ? selectedTeam.team.logos[0].href: '';
            const logoImg = document.getElementById('team-logo');
            logoImg.src = logoUrl;
            logoImg.style.display = 'flex'
        });
    } catch(error){
        console.error('Error fetching NBA Teams:', error);
}
}
fetchNHLTeams();