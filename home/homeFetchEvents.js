"use strict";

// Fetch Events

import { formatDateToEst } from './homeUtilities.js';
import { apiURLs } from './homeAPIs.js';


// Fetch ESPN APIs
export async function fetchEvents(sportKey, elementId) {
    try {
        const response = await fetch(apiURLs[sportKey]);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        // Console Log the Events
        console.log(data);

        // Clear anything that already exists on the Page
        const scoreboard = document.getElementById(elementId);
        scoreboard.innerHTML = '';

        // Create List element if there are NO games scheduled
        if (data.events.length === 0) {
            const noGames = document.createElement('li');
            noGames.classList.add('gtwGame');
            noGames.textContent = 'No games scheduled';
            scoreboard.appendChild(noGames);
            return;
        }

        // Save properties from each API within an Object
        data.events.forEach(event => {
            const gameInfo = {
                shortName: event.shortName,
                gameStatus: event.competitions[0].status.type.description,
                homeScore: event.competitions[0].competitors[0].score,
                awayScore: event.competitions[0].competitors[1].score,
                date: formatDateToEst(event.competitions[0].date)
            };

            // Create List element for every game that is happening 
            const scoreboardItem = document.createElement('li');
            scoreboardItem.classList.add('gtwGame');
            // Add gameInfo to List Element
            scoreboardItem.innerHTML = `${gameInfo.date}<br>${gameInfo.shortName} <strong>(${gameInfo.gameStatus})</strong> ${gameInfo.awayScore} - ${gameInfo.homeScore}`;
            scoreboard.appendChild(scoreboardItem);
        });
    } catch (error) {
        console.error(`Error fetching ${sportKey.toUpperCase()} Events:`, error);
    }
}