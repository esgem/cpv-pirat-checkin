/* -----------------------------------------------------------------------------------------
 * POSTKASSE SERVER API - hjælpe metoder til at henbte data fra postkasserne i skyen
 * -----------------------------------------------------------------------------------------
 *
 * Funktionerne herunder sender og henter besekder til vores "postkasse" i skyen.
 * De skal ikke ændres... :-)
 *
 * De api_funktioner der skal bruges i dine egne funktioner er disse:
 *
 *   - api_sendBeskedTilPostkassenISkyen(modtagerPostkasseId, besked)
 *   - api_hentBeskederFraPostkassenISkyen()
 *   - api_hentPostkasseNavnFraSkyen(postkasseId)
 *   - api_hentModtagerPostkasserFraSkyen()
 *
 */

const apiUser = 'CpvApi';
const apiPassword = 'CPV!api:2023';
const postkasseHost = 'https://kommandocentral.pythonanywhere.com';
//const postkasseHost = 'http://127.0.0.1:5000';

const api_sendBeskedTilPostkassenISkyen = async (
    modtagerPostkasseId,
    besked
) => {
    try {
        const token = await fetchAccessTokenFromServer();
        await sendMessageCommandToServer(
            MIT_POSTKASSE_ID,
            modtagerPostkasseId,
            besked,
            token
        );
    } catch (error) {
        console.error('Authentication and sending message failed:', error);
    }
};

const api_hentBeskederFraPostkassenISkyen = async () => {
    try {
        const token = await fetchAccessTokenFromServer();
        const data = await getMessagesFromServer(token);
        const messages = [];
        if (data.events) {
            for (var key in data.events) {
                if (data.events.hasOwnProperty(key)) {
                    const event = data.events[key];
                    messages.push(event);
                }
            }
        }
        return messages;
    } catch (error) {
        console.error('Authentication and reading message failed:', error);
    }
};

const api_hentPostkasseNavnFraSkyen = async (postkasseId) => {
    const mailboxes = await api_hentModtagerPostkasserFraSkyen();
    const mailbox = mailboxes.find((mailbox) => mailbox.id == postkasseId);
    if (mailbox) {
        return mailbox.name;
    }
};

const api_hentModtagerPostkasserFraSkyen = async () => {
    try {
        const token = await fetchAccessTokenFromServer();
        const data = await getOwnUnits(token);
        let mailBoxes = [];
        if (data.units) {
            for (var key in data.units) {
                const box = { id: key, name: data.units[key] };
                mailBoxes.push(box);
            }
        }
        return mailBoxes;
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

const sendMessageCommandToServer = async (
    fromPostkasseId,
    toPostkasseId,
    message,
    token
) => {
    const url = `${postkasseHost}/api/command/${fromPostkasseId}/${toPostkasseId}/BESKED/${message}`;
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
        console.log('Message was send!');
    } catch (error) {
        console.error('Send message failed:', error);
        throw error; // Re-throw for higher level handling
    }
};

const getMessagesFromServer = async (token) => {
    const url = `${postkasseHost}/api/commands/${MIT_POSTKASSE_ID}`;
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
                `Error getting messages from postkasse "${MIT_POSTKASSE_ID}": ${response.status} - ${errorDetails.message}`
            );
        }
        const data = await response.json();
        console.log('Messages read!');
        return data;
    } catch (error) {
        console.error('Getting messages failed:', error);
        throw error; // Re-throw for higher level handling
    }
};

const getOwnUnits = async (token) => {
    const url = `${postkasseHost}/api/units/own`;
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
                `Error getting all tracks (mailboxes) for departement: ${response.status} - ${errorDetails.message}`
            );
        }
        const data = await response.json();
        console.log('Mailbox names read!');
        return data;
    } catch (error) {
        console.error('Getting tracks (mailboxes) failed:', error);
        throw error; // Re-throw for higher level handling
    }
};

const fetchAccessTokenFromServer = async () => {
    const url = `${postkasseHost}/auth/token`;
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
