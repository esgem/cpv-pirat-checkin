// Denne skal sættes til dit eget postkasse ID
const MIT_ENHEDS_ID = 2; // = unit-id

const visMitEgetNavn = async (nameElementId) => {
    const navn = await api_hentEnhedsNavn(MIT_ENHEDS_ID);
    const nameElement = document.getElementById(nameElementId);
    if (navn) {
        nameElement.innerHTML = navn;

        const titleElement = document.getElementById('titleElement');
        titleElement.innerHTML += navn;
    } else {
        nameElement.style = 'color:red';
        nameElement.innerHTML =
            'ingen navn fundet... husk at rette MIT_POSTKASSE_ID i "mine-egne-funktioner.js"';
    }
};

const hentOgVisMuligeModtagerEnhederIDropdown = async (
    modtagerDropdownElementId
) => {
    // Vi starter med at sætte en værdi, der skal bruges, hvis vi IKKE finder nogen postkasser
    let mailboxSelectorHtml =
        '<option value="0">- der blev ikke fundet nogen modtagere!! -</option>';

    const allePostkasser = await api_hentModtagerEnheder();

    // vi får postkasserne som en liste, hvor hvert element i listen har formen:
    //
    //   { id, name }

    // Først tjekker vi om der ER nogen postkasser (der skal være flere end nul...)
    if (allePostkasser && allePostkasser.length > 0) {
        // Nu "nulstiller" vi valgmulighederne:
        mailboxSelectorHtml = '';
        // så vi er klar til at lave en løkke, der kan "pakke" motdager-postkasserne ind i
        // noget HTML som vi kan bruge i <select> dropdownen - dvs. et <option...> element
        allePostkasser.forEach((postkasse) => {
            const nytElement = `<option value="${postkasse.id}">${postkasse.name}</option>`;
            mailboxSelectorHtml += nytElement;
            console.log(nytElement);
        });
    }
    document.getElementById(modtagerDropdownElementId).innerHTML =
        mailboxSelectorHtml;
};

const sendTilModtager = async (event) => {
    // kode der skal kaldes når man trykker på "Send" knappen
    event.preventDefault();

    const modtagerPostkasseId = document.getElementById('modtager').value;
    const besked = document.getElementById('besked').value;

    await api_sendTilEnhed(modtagerPostkasseId, besked);
    alert('Beskeden er sendt!');
};

const hentOgVisHvadDerErModtaget = async (messageElementId) => {
    // kode til at hente beskeden og vise den på siden

    // Vi definerer lige teksten der skal vises, hvis der ikke er nogen beskeder
    let beskedTextHtml = '<i>Der er ingen beskeder lige nu...</i>';

    // Nu prøver vi at hente alle beskeder der ligger i vores postkasse i skyen
    const modtagneBeskeder = await api_hentMineEgne();

    // Beskederne kommer i en liste (et "array")

    // Så først tjekker vi om der overhovedet ER nogen beskeder til os
    // (der skal være mere end nul beskeder...)
    if (modtagneBeskeder && modtagneBeskeder.length > 0) {
        // Nu da vi ved at der er mere end nul beskeder, skal vi have dem "pakket" ind i noget
        // HTML kode som vi kan vise i dokumentet.

        // Vi bruger fed skrift (<strong>) og alm tekst (<p>) (men det kan man jo altid lave om,
        // hvis man vil...)

        beskedTextHtml = '';
        // Her laver vi en løkke så vi kan få fat på hver besked i listen
        modtagneBeskeder.forEach((command) => {
            beskedTextHtml += `<strong>Fra:</strong> ${command.from_unit_name}`;
            beskedTextHtml += `<br />`;
            beskedTextHtml += `<strong>Dato:</strong> ${command.created}`;
            beskedTextHtml += `<br />`;
            beskedTextHtml += `<strong>Besked:</strong> ${command.message}`;
            beskedTextHtml += `<br />`;
            beskedTextHtml += `<br />`;
        });
    }

    // Til sidst lægger vi beskederne ind i HTML koden i vores dokument
    const messageElement = document.getElementById(messageElementId);
    messageElement.innerHTML = beskedTextHtml;
};

const sletBesked = () => {
    // kode til at slette en besked.
    // Det gør vi i næste sæson....! :-)
    alert('Dette har vi ikke nået endnu - det må vi gøre i næste sæson!!');
};
