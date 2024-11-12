"use strict";

// Call ESPN Event APIs
import { fetchEvents } from "./homeFetchEvents.js";

fetchEvents('nfl', 'nfl');
fetchEvents('nba', 'nba');
fetchEvents('mlb', 'mlb');
fetchEvents('nhl', 'nhl');