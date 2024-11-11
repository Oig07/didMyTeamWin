"use strict";
export function parseTimeInEST(dateString) {
    const date = new Date(dateString);
    const options = {
        timeZone: 'America/New_York',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };
    return date.toLocaleTimeString('en-US', options);
}

export function getOrdinalPeriod(period) {
    switch (period) {
        case 1: return "1st";
        case 2: return "2nd";
        case 3: return "3rd";
        case 4: return "4th";
        default: return `${period}th`;
    }
}