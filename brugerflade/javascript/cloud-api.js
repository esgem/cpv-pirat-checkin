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

const api_hentEnhedsNavn = async (enhedsId) => {
    const units = await api_hentModtagerEnheder();
    const unit = units.find((unit) => unit.id == enhedsId);
    if (unit) {
        return unit.name;
    }
};

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

const fetchAccessTokenFromServer = async () => {
    const url = `${apiHost}/auth/token`;
    const authString = `${apiUser}:${apiPassword}`;
    const headers = {
        Authorization: 'Basic ' + btoa(authString),
        'Content-Type': 'application/json',
    };
    //{ method: 'get', mode: 'cors' }
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
