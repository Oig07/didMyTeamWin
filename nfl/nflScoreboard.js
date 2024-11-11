import { fetchTeamInfo } from './fetchNFLTeams.js';
import { parseTimeInEST, getOrdinalPeriod } from './nflUtilities.js';

const apiURL = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams";
const nflApiUrl="http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard";

export async function fetchScoreboard(nflApiUrl, teamAbbr) {
    try {
        const response = await fetch(nflApiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        const gameList = document.getElementById('game-list');
        gameList.innerHTML = ''; // Clear any previous games

        const games = data.events.filter(event => {
            const teamNames = event.competitions[0].competitors.map(comp => comp.team.abbreviation);
            return teamNames.includes(teamAbbr);
        });

        const selectedTeamShortName = await fetchTeamInfo(nflApiUrl, teamAbbr);

        if (games.length === 0) {
            createByeItem(gameList, selectedTeamShortName);
            return;
        }

        games.forEach(game => {
            const gameItem = createGameItem(game, teamAbbr, selectedTeamShortName);
            gameList.appendChild(gameItem);
        });

    } catch (error) {
        console.error('Error fetching scoreboard:', error);
    }
}

function createByeItem(gameList, teamName) {
    const byeItem = document.createElement('li');
    byeItem.textContent = `The ${teamName} are on a BYE this week.`;
    gameList.appendChild(byeItem);
}

function createGameItem(game, teamAbbr, teamShortName) {
    const gameItem = document.createElement('li');
    const homeCompetitor = game.competitions[0].competitors.find(comp => comp.homeAway === 'home');
    const awayCompetitor = game.competitions[0].competitors.find(comp => comp.homeAway === 'away');

    const selectedTeamCompetitor = homeCompetitor.team.abbreviation === teamAbbr ? homeCompetitor : awayCompetitor;
    const opponentCompetitor = selectedTeamCompetitor === homeCompetitor ? awayCompetitor : homeCompetitor;

    const selectedTeamScore = parseInt(selectedTeamCompetitor.score, 10);
    const opponentScore = parseInt(opponentCompetitor.score, 10);
    const gameStatus = game.status.type.description;
    const gamePeriod = game.status.period;
    const gameOrdinalPeriod = getOrdinalPeriod(gamePeriod);
    const gameClock = game.status.displayClock;

    if (gameStatus === "Scheduled") {
        const gameDate = parseTimeInEST(game.date);
        gameItem.innerHTML = `The ${teamShortName} are scheduled to play against the ${opponentCompetitor.team.shortDisplayName} today at ${gameDate} EST.`;
    } else if (gameStatus === "In Progress") {
        gameItem.innerHTML = `The ${teamShortName} are currently playing against the ${opponentCompetitor.team.shortDisplayName}. There is ${gameClock} left in the ${gameOrdinalPeriod} Quarter. <br>Current Score: ${teamShortName} (${selectedTeamScore}) - ${opponentCompetitor.team.shortDisplayName} (${opponentScore}).`;
    } else if (gameStatus === "End of Period") {
        gameItem.innerHTML = `It is the end of the ${gameOrdinalPeriod} Quarter. The ${teamShortName} are currently playing against the ${opponentCompetitor.team.shortDisplayName}. <br>Current Score: ${teamShortName} (${selectedTeamScore}) - ${opponentCompetitor.team.shortDisplayName} (${opponentScore}).`;
    } else {
        let resultText = getResultText(selectedTeamScore, opponentScore, selectedTeamCompetitor, opponentCompetitor);
        gameItem.textContent = `${resultText} (${selectedTeamScore} - ${opponentScore})`;
    }

    return gameItem;
}

function getResultText(selectedTeamScore, opponentScore, selectedTeamCompetitor, opponentCompetitor) {
    if (selectedTeamScore > opponentScore) {
        return `The ${selectedTeamCompetitor.team.shortDisplayName} beat the ${opponentCompetitor.team.shortDisplayName}! Final Score: `;
    } else if (selectedTeamScore < opponentScore) {
        return `The ${selectedTeamCompetitor.team.shortDisplayName} lost to the ${opponentCompetitor.team.shortDisplayName}! Final Score: `;
    } else {
        return `The ${selectedTeamCompetitor.team.shortDisplayName} tied with the ${opponentCompetitor.team.shortDisplayName}! Final Score: `;
    }
}