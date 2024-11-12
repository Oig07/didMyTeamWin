"use strict";

// Convert UTC Date String to EST
export function formatDateToEst(dateString){
    const date = new Date(dateString);
    if (isNaN(date.getTime())){
        return 'Invalid Date';
    }
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/New_York',
        hour12: true
    };
    return new Intl.DateTimeFormat('en-US',options).format(date).replace(/, /g, ' ')+' EST';

}