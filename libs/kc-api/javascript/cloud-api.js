/* -----------------------------------------------------------------------------------------
 * POSTKASSE SERVER API - hjælpe metoder til at henbte data fra postkasserne i skyen
 * -----------------------------------------------------------------------------------------
 *
 * Funktionerne herunder sender og henter kommandoer til vores "central" i skyen.
 * De skal ikke ændres... :-)
 *
 * De api_funktioner der skal bruges i dine egne funktioner er disse:
 *
 *   - api_sendTilEnhed(modtagerEnhedsId, besked)
 *   - api_hentMineEgne()
 *   - api_hentEnhedsNavn(enhedsId)
 *   - api_hentModtagerEnheder()
 *
 */

const apiUser = 'CpvApi';
const apiPassword = 'CPV!api:2023';
const apiHost = 'https://kommandocentral.pythonanywhere.com';
//const postkasseHost = 'http://127.0.0.1:5000';


/**
 * Send besked til en enhed
 * @param {number} modtagerEnhedsId Id af enhed der skal modtage beskeden
 * @param {String} besked Beskeden der skal sendes
 */
const api_sendTilEnhed = async (modtagerEnhedsId, besked) => {
    try {
        const token = await fetchAccessTokenFromServer();
        await sendCommandToServer(
            MIT_ENHEDS_ID,
            modtagerEnhedsId,
            'BESKED', //kommandoen der skal sendes
            besked,
            token
        );
    } catch (error) {
        console.error('Authentication and sending message failed:', error);
    }
};

/**
 * @typedef Command
 * @type {object}
 * @property {string} command_id
 * @property {string} created
 * @property {string} from_department_id
 * @property {number} from_unit_id
 * @property {string} from_unit_name
 * @property {string} message
 */

/**
 * Hent mine modtagede kommandoer
 * @returns {Commnad[]} De modtagede kommandoer
 */
const api_hentMineEgne = async () => {
    try {
        const token = await fetchAccessTokenFromServer();
        const data = await getCommandsFromServer(token);
        const commandsReceived = [];
        if (data.commands) {
            for (var key in data.commands) {
                if (data.commands.hasOwnProperty(key)) {
                    const command = data.commands[key];
                    commandsReceived.push(command);
                }
            }
        }
        return commandsReceived;
    } catch (error) {
        console.error('Authentication and reading message failed:', error);
    }
};

/**
 * Hent navnet af en enhed 
 * @param {number} enhedsId Id af enhed
 * @returns {string?} Enhedens navn
 */
const api_hentEnhedsNavn = async (enhedsId) => {
    const units = await api_hentModtagerEnheder();
    const unit = units.find((unit) => unit.id == enhedsId);
    if (unit) {
        return unit.name;
    }
};

/**
 * Hent alle modtager-enheder i min afdeling
 * @returns {{
 *      id: string,
*       name: string
 * }[]} Liste af alle modtager-enheder
 */
const api_hentModtagerEnheder = async () => {
    try {
        const token = await fetchAccessTokenFromServer();
        const data = await getOwnUnits(token);
        let availableUnits = [];
        if (data.units) {
            for (var key in data.units) {
                const unit = { id: key, name: data.units[key] };
                availableUnits.push(unit);
            }
        }
        return availableUnits;
    } catch (error) {
        console.error(
            'Authentication and reading all mailboxes failed:',
            error
        );
    }
};

// -----------------------------------------
// Helpers to make the requests to the server
// -----------------------------------------

/**
 * Send command message to server
 * @param {number} fromUnitId 
 * @param {number} toUnitId 
 * @param {string} command 
 * @param {string} message 
 * @param {string} token 
 */
const sendCommandToServer = async (
    fromUnitId,
    toUnitId,
    command,
    message,
    token
) => {
    const url = `${apiHost}/api/command/${fromUnitId}/${toUnitId}/${command}/${message}`;
    const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
        });
        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(
                `Error sending message: ${response.status} - ${errorDetails.message}`
            );
        }
        console.log('Command was send!');
    } catch (error) {
        console.error('Send command failed:', error);
        throw error; // Re-throw for higher level handling
    }
};

/**
 * Gets all received commands from the server
 * @param {string} token
 * @returns {Promise<{
 *      json_source: "Python dict",
 *      to_department_id: string,
 *      to_unit_id: number,
 *      commands: {
 *          [command_id: string]: Command
 *      }
 * }>}
 */
const getCommandsFromServer = async (token) => {
    const url = `${apiHost}/api/commands/${MIT_ENHEDS_ID}`;
    const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: headers,
        });
        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(
                `Error getting commands from unit "${MIT_ENHEDS_ID}": ${response.status} - ${errorDetails.message}`
            );
        }
        const data = await response.json();
        console.log('Commands read!');
        return data;
    } catch (error) {
        console.error('Getting messages failed:', error);
        throw error; // Re-throw for higher level handling
    }
};

/**
 * Fetch all units in own department
 * @param {string} token 
 * @returns {{
 *      json_source: "Python dict",
 *      department_id: string,
 *      units: {
 *          [unit_id: number]: string
 *      }
 * }}
 */
const getOwnUnits = async (token) => {
    const url = `${apiHost}/api/units/own`;
    const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: headers,
        });
        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(
                `Error getting all units for departement: ${response.status} - ${errorDetails.message}`
            );
        }
        const data = await response.json();
        console.log('Unit names read!');
        return data;
    } catch (error) {
        console.error('Getting units failed:', error);
        throw error; // Re-throw for higher level handling
    }
};

/**
 * Fetch new JWT token from server
 * @returns {String} Token returned from server
 */
const fetchAccessTokenFromServer = async () => {
    const url = `${apiHost}/auth/token`;
    const authString = `${apiUser}:${apiPassword}`;
    const headers = {
        Authorization: 'Basic ' + btoa(authString),
        'Content-Type': 'application/json',
    };
    
    try {
        const response = await fetch(url, {
            headers: headers,
            method: 'get',
            mode: 'cors',
        });
        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(
                `Error fetching token: ${response.status} - ${errorDetails.message}`
            );
        }
        const data = await response.json();
        const token = data.token;
        if (token) {
            return token;
        } else {
            throw new Error('No token returned in the data from the server');
        }
    } catch (error) {
        console.error('Fetch token failed:', error);
        throw error; // Re-throw for higher level handling
    }
};
