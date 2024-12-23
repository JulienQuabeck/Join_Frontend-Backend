let chosenContacts = []; // Array for "Assigned to" - for all contacts which checkboxes are checked
let chosenContactsJson = [];
let allContactsFromServer = [];
let allTasksFromServer = [];
let firstloadContacts = true;

/**
 * This function loads all necessary components for the site
 */
async function onInit() {
    try {
        let allTasks = await loadTasksFromServer();
        let allContacts = await getItemContacts();
        
        allContactsFromServer = allContacts;
        allTasksFromServer=allTasks;
    } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
    }
};

/**
 * This function checks the screenwidth and adds margin to the Top of Content2 (right Content Container) if necessary
 */
function checkScreenWidth(){
    if (document.body.clientWidth <= 1400){
        if(chosenContacts.length != 0 && !document.getElementById('ContainerForAllPossibleContacts').classList.contains('d-none')){
            document.getElementById('Content2').style.marginTop = "230px";
        }else if (chosenContacts.length === 0 && !document.getElementById('ContainerForAllPossibleContacts').classList.contains('d-none')) {
            document.getElementById('Content2').style.marginTop = "230px";
        } else if (chosenContacts.length != 0 && document.getElementById('ContainerForAllPossibleContacts').classList.contains('d-none')) {
            document.getElementById('Content2').style.marginTop = "20px";
        } else {
            document.getElementById('Content2').style.marginTop = "0px";
        }
    }else{
        document.getElementById('Content2').style.marginTop = "0px";
    }
}

/**
 * This function turns the arrow-image of the assignedTo-Section upside down
 */
function flipTheImage(){
    document.getElementById('assignedToImg').src="/Frontend/assets/img/arrow_down.png";
}

/**
 * This function displays the List of all choosable Contacts
 */
function displayContacts() {
    document.getElementById('ContainerForAllPossibleContacts').classList.remove('d-none');
}

/**
 * This function put the necessary fields of "Assigned To" in foreground
 */
function putAssignedToInForeground() {
    document.getElementById('ContainerForAllPossibleContacts').setAttribute('style', 'z-index:999');
    document.getElementById('SubcontentContacts').setAttribute('style', 'z-index:999');
}

/**
 * This function opens an overlay to close the current focused section by a click somewhere else
 */
function openOverlay() {
    document.getElementById('overlayContacts').classList.toggle('d-none');
}

/**
 * This function check / uncheck the checkbox of the chosen contact
 * @param {int} i - number of the checkbox
 */
function checkCheckbox(contactId, event){
    event.stopImmediatePropagation();
    event.preventDefault();
    debugger
    const checkbox = document.getElementById(`checkbox${contactId}`);
    addContactToArray(contactId);
}

/**
 * This function deletes Contacts from an array
 * @param {*} currentTaskFromServer 
 * @param {*} contactId 
 */
function deleteContactFromArray(currentTaskFromServer, contactId){
    const index = task.contacts.findIndex(id => id === contactId);
    const ArrayPos = currentTaskFromServer.contacts.findIndex(contact =>  String(contact) === String(contactId)); 
    currentTaskFromServer.contacts.splice(ArrayPos,1);
    createCirclesToChosenContactContainer2(currentTaskFromServer);
}

/**
 * This function deletes the number of the contact from the Array called chosenContacts
 * @param {int} i - the position of the contact in the Json-Array
 */
function deleteChosenContact(i) {
    chosenContacts.splice(chosenContacts.indexOf(i), 1);
    createCirclesToChosenContactContainer(chosenContacts);
}

/**
 * This function creates the circles with the initials under the inputs after a contact was chosen
 */
function createCirclesToChosenContactContainer(chosenContact) {
    let adress = 'ContainerForAllChosenContacts';
    let Content = document.getElementById(`${adress}`);
    Content.innerHTML = '';
    for (let j = 0; j < chosenContact.contacts.length; j++) {
        let id = chosenContact.contacts[j];
        let ChangeCircles = true;
        creatingCircle(id, adress, ChangeCircles);
    }
    displaydiv();
}

/**
 * This Function displays the chosenContacts div, if min. one Contact is currently chosen
 */
function displaydiv(){
    if (chosenContactsFromTask.length == 0){
        document.getElementById('ContainerForAllChosenContacts').classList.add('d-none'); 
    }else{
        document.getElementById('ContainerForAllChosenContacts').classList.remove('d-none');
    }
}

/**
 * This function selects the first letter of the first and the last name for the displayed circle
 * @param {int} i - the position of the contact in the Json-Array
 * @returns the first letter of the first and the last name for the displayed circle
 */
function gettingInitials(name) {
    let letter = name.toUpperCase().slice(0, 1);
    return letter;
}

/**
 * This function creates the circle at the "assigned to" Container
 * @param {int} i - the position of the contact in the Json-Array
 * @param {string} adress - carries the information about the id, where the Circle should be displayed
 */
async function creatingCircle(i, adress, ChangeCircles) {
    let contact = await getItemContacts();
    if(ChangeCircles === true){
        let j = contact.findIndex(contact => contact.id === i); 
        i = j;
        ChangeCircles = false;
    }
    let name = contact[i].username;
    let nameParts = name.split("_")
    let firstname = nameParts[0];
    let lastname = nameParts[1];
    let firstLetterName = gettingInitials(firstname);
    let firstLetterLastname = gettingInitials(lastname);
    let color = contacts[i]['color'];
    document.getElementById(`${adress}`).innerHTML += `
    <div id="circle${i}" class="circle" style="background-color:${color}">${firstLetterName}${firstLetterLastname}</div>
    `;
}

/**
 * This function separates the Name of a person from the Json-Array and safes it in the ContactName - Container of the Person
 * @param {int} i - the position of the contact in the Json-Array
 */
function gettingNames(i, contacts) {
    let name = contacts[i]['username'];
    document.getElementById(`ContactName${contacts[i].user_id}`).innerHTML += `${name}`;
}

/**
 * This function let the user search for a contact in the Assigned To input-field by typing in the searched name
 */
function filterContacts() {
    let search = document.getElementById('assignedToSelect').value;
    search = search.toLowerCase();
    let ContactList = document.getElementById('ContainerForAllPossibleContacts');
    ContactList.innerHTML = '';
    HtmlForFilter(search, ContactList);
}

/**
 * This function generates the HTML for the filter-function
 * @param {string} search - The name the user wants to search for
 * @param {HTML} ContactList - List of names that contain the searched character string
 */
function HtmlForFilter(search, ContactList){
    for (let i = 0; i < contacts.length; i++) {
        let adress = `contactCircle${i}`;
        let name = contacts[i]['Name'];
        if (name.toLowerCase().includes(search)) {
            ContactList.innerHTML += `
            <div id="contact${contacts[i].id}" class="contactbox contact">
                <div id="contactCircle${contacts[i].id}">
                </div>
                <div>
                    <div id="ContactName${contacts[i].id}" class="contactName">
                        ${contacts[i]['Name']}
                    </div>
                </div>
                <div id="checkboxContainer${contacts[i].id}" class="checkboxContainer">
                    <input id="checkbox${contacts[i].id}" type="checkbox" class="checkboxes hover">
                </div>
            </div>`;
            creatingCircle(i, adress);
        }
    }
}

// /**
//  * opens the Overlay and triggers the gernerateHTMLForContactsContainer-function
//  */
function generateContactsContainer() {
    openOverlay();
    generatingHTMLForContactsContainer();
}

/**
 * This function generates the HTML-Container for every contact and fills it with information
 */
async function generatingHTMLForContactsContainer() {
    let contactsContainer = document.getElementById('ContainerForAllPossibleContacts');
    contactsContainer.innerHTML = '';
    contacts = await getItemContacts();    
    for (let i = 0; i < contacts.length; i++) {
        let adress = `contactCircle${contacts[i].user_id}`;
        contactsContainer.innerHTML += `
        <div id="contact${contacts[i].id}" class="contactbox contact">
            <div id="contactCircle${contacts[i].user_id}"> 
            </div>
            <div>
                <div id="ContactName${contacts[i].user_id}" class="contactName"></div>
            </div>
            <div id="checkboxContainer${contacts[i].user_id}" class="checkboxContainer">
                <input id="checkbox${contacts[i].user_id}" type="checkbox" class="checkboxes hover" onclick="event.stopPropagation(); checkCheckbox(${contacts[i].user_id}, event)">
            </div>
        </div>`;
        creatingCircle(i, adress);
        gettingNames(i, contacts);
    }
    checkIfCheckboxesWereChecked(firstloadContacts);
}

/**
 * This function pushes the number of the contact into an Array called chosenContacts
 * @param {int} i - the position of the contact in the Json-Array
 */
function addChosenContact(currentTaskFromServer, contactId) {
    currentTaskFromServer.contacts.push(contactId);
}