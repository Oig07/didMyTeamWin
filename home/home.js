"use strict";

const nflApiUrl="http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard";
const nbaApiUrl="https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard"
const mlbApiUrl="https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard"
const nhlApiUrl="https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard"

// Function to fetch NFL Events
async function fetchNFLEvents(){
    try{
        const response = await fetch(nflApiUrl);
        // Check if response is valid
        if (!response.ok){
            throw new Error (`Http error! Status: ${response.status}`)
        }
        // Parse the JSON Response
        const data=await response.json();
        // Log Data
        console.log(data)

        // Get Variables
        //const shortNames = data.events.map(event=>event.shortName);
        //const gameStatus = data.events.map(event=>event.status.type.description)

        // Format Date
        // Transform Date
        function formatDateToEst(dateString){
            // Parse the Date string into a Date Object
            const date = new Date(dateString);

            //Check if Date is valid
            if(isNaN(date.getTime())){
                return 'Invalid Date';
            }

            // Options for Formatting
            const options = {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'America/New_York', // EST timezone
                hour12: true // Use 12-hour format
            };

            // Format the date
            const formatter = new Intl.DateTimeFormat('en-US',options);
            const formattedDate = formatter.format(date)

            // Return formatted date in the desired format
            return `${formattedDate.replace(/, /g, ' ')} EST`
        }

        // Get NFL Card
        const scoreboard = document.getElementById('nfl');

        // Clear previosu data
        scoreboard.innerHTML = '';

         // Check if there are no games
         if (data.events.length === 0){
            const noGames = document.createElement('li');
            noGames.classList.add('gtwGame');
            scoreboard.appendChild(noGames);
        }

        // Loop through the events
        data.events.forEach(event => {
            const gameInfo = {
                shortName: event.shortName,
                gameStatus: event.competitions[0].status.type.description,
                homeScore: event.competitions[0].competitors[0].score,
                awayScore: event.competitions[0].competitors[1].score,
                date: formatDateToEst(event.competitions[0].date)
            };

            const scoreboardItem = document.createElement('li');
            scoreboardItem.classList.add('gtwGame');
            scoreboardItem.innerHTML = `${gameInfo.date}<br>${gameInfo.shortName} <strong>(${gameInfo.gameStatus})</strong> ${gameInfo.awayScore} - ${gameInfo.homeScore}`
            // Append to the scoreboard
            scoreboard.appendChild(scoreboardItem)
        })
    } catch(error){
        console.error('Error fetching NFL Events:', error)
    }
}
fetchNFLEvents()

/* Fetch NBA Events */
// Function to fetch NFL Events
async function fetchNBAEvents(){
    try{
        const response = await fetch(nbaApiUrl);
        // Check if response is valid
        if (!response.ok){
            throw new Error (`Http error! Status: ${response.status}`)
        }
        // Parse the JSON Response
        const data=await response.json();
        // Log Data
        console.log(data)

        // Get Variables
        //const shortNames = data.events.map(event=>event.shortName);
        //const gameStatus = data.events.map(event=>event.status.type.description)

        // Format Date
        // Transform Date
        function formatDateToEst(dateString){
            // Parse the Date string into a Date Object
            const date = new Date(dateString);

            //Check if Date is valid
            if(isNaN(date.getTime())){
                return 'Invalid Date';
            }

            // Options for Formatting
            const options = {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'America/New_York', // EST timezone
                hour12: true // Use 12-hour format
            };

            // Format the date
            const formatter = new Intl.DateTimeFormat('en-US',options);
            const formattedDate = formatter.format(date)

            // Return formatted date in the desired format
            return `${formattedDate.replace(/, /g, ' ')} EST`
        }

        // Get NFL Card
        const scoreboard = document.getElementById('nba');

        // Clear previosu data
        scoreboard.innerHTML = '';

         // Check if there are no games
         if (data.events.length === 0){
            const noGames = document.createElement('li');
            noGames.classList.add('gtwGame');
            scoreboard.appendChild(noGames);
        }

        // Loop through the events
        data.events.forEach(event => {
            const gameInfo = {
                shortName: event.shortName,
                gameStatus: event.competitions[0].status.type.description,
                homeScore: event.competitions[0].competitors[0].score,
                awayScore: event.competitions[0].competitors[1].score,
                date: formatDateToEst(event.competitions[0].date)
            };

            const scoreboardItem = document.createElement('li');
            scoreboardItem.classList.add('gtwGame');
            scoreboardItem.innerHTML = `${gameInfo.date}<br>${gameInfo.shortName} <strong>(${gameInfo.gameStatus})</strong> ${gameInfo.awayScore} - ${gameInfo.homeScore}`
            // Append to the scoreboard
            scoreboard.appendChild(scoreboardItem)
        })
    } catch(error){
        console.error('Error fetching NBA Events:', error)
    }
}
fetchNBAEvents()

/* Fetch MLB Events */
// Function to fetch MLB Events
async function fetchMLBEvents(){
    try{
        const response = await fetch(mlbApiUrl);
        // Check if response is valid
        if (!response.ok){
            throw new Error (`Http error! Status: ${response.status}`)
        }
        // Parse the JSON Response
        const data=await response.json();
        // Log Data
        console.log(data)

        // Get Variables
        //const shortNames = data.events.map(event=>event.shortName);
        //const gameStatus = data.events.map(event=>event.status.type.description)

        // Format Date
        // Transform Date
        function formatDateToEst(dateString){
            // Parse the Date string into a Date Object
            const date = new Date(dateString);

            //Check if Date is valid
            if(isNaN(date.getTime())){
                return 'Invalid Date';
            }

            // Options for Formatting
            const options = {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'America/New_York', // EST timezone
                hour12: true // Use 12-hour format
            };

            // Format the date
            const formatter = new Intl.DateTimeFormat('en-US',options);
            const formattedDate = formatter.format(date)

            // Return formatted date in the desired format
            return `${formattedDate.replace(/, /g, ' ')} EST`
        }

        // Get NFL Card
        const scoreboard = document.getElementById('mlb');

        // Clear previosu data
        scoreboard.innerHTML = '';

        // Check if there are no games
        if (data.events.length === 0){
            const noGames = document.createElement('li');
            noGames.classList.add('gtwGame');
            scoreboard.appendChild(noGames);
        }

        // Loop through the events
        data.events.forEach(event => {
            const gameInfo = {
                shortName: event.shortName,
                gameStatus: event.competitions[0].status.type.description,
                homeScore: event.competitions[0].competitors[0].score,
                awayScore: event.competitions[0].competitors[1].score,
                date: formatDateToEst(event.competitions[0].date)
            };

            const scoreboardItem = document.createElement('li');
            scoreboardItem.classList.add('gtwGame');
            scoreboardItem.innerHTML = `${gameInfo.date}<br>${gameInfo.shortName} <strong>(${gameInfo.gameStatus})</strong> ${gameInfo.awayScore} - ${gameInfo.homeScore}`
            // Append to the scoreboard
            scoreboard.appendChild(scoreboardItem)
        })
    } catch(error){
        console.error('Error fetching MLB Events:', error)
    }
}
fetchMLBEvents()

/* Fetch NHL Events */
// Function to fetch MLB Events
async function fetchNHLEvents(){
    try{
        const response = await fetch(nhlApiUrl);
        // Check if response is valid
        if (!response.ok){
            throw new Error (`Http error! Status: ${response.status}`)
        }
        // Parse the JSON Response
        const data=await response.json();
        // Log Data
        console.log(data)

        // Get Variables
        //const shortNames = data.events.map(event=>event.shortName);
        //const gameStatus = data.events.map(event=>event.status.type.description)

        // Format Date
        // Transform Date
        function formatDateToEst(dateString){
            // Parse the Date string into a Date Object
            const date = new Date(dateString);

            //Check if Date is valid
            if(isNaN(date.getTime())){
                return 'Invalid Date';
            }

            // Options for Formatting
            const options = {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'America/New_York', // EST timezone
                hour12: true // Use 12-hour format
            };

            // Format the date
            const formatter = new Intl.DateTimeFormat('en-US',options);
            const formattedDate = formatter.format(date)

            // Return formatted date in the desired format
            return `${formattedDate.replace(/, /g, ' ')} EST`
        }

        // Get NFL Card
        const scoreboard = document.getElementById('nhl');

        // Clear previosu data
        scoreboard.innerHTML = '';

        // Check if there are no games
        if (data.events.length === 0){
            const noGames = document.createElement('li');
            noGames.classList.add('gtwGame');
            scoreboard.appendChild(noGames);
        }

        // Loop through the events
        data.events.forEach(event => {
            const gameInfo = {
                shortName: event.shortName,
                gameStatus: event.competitions[0].status.type.description,
                homeScore: event.competitions[0].competitors[0].score,
                awayScore: event.competitions[0].competitors[1].score,
                date: formatDateToEst(event.competitions[0].date)
            };

            const scoreboardItem = document.createElement('li');
            scoreboardItem.classList.add('gtwGame');
            scoreboardItem.innerHTML = `${gameInfo.date}<br>${gameInfo.shortName} <strong>(${gameInfo.gameStatus})</strong> ${gameInfo.awayScore} - ${gameInfo.homeScore}`
            // Append to the scoreboard
            scoreboard.appendChild(scoreboardItem)
        })
    } catch(error){
        console.error('Error fetching NHL Events:', error)
    }
}
fetchNHLEvents()