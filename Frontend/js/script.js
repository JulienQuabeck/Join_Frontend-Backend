let allTasks = [];
let column = '';
let allSubtasks = [];
let initials = "";

function gettingInitialsForHeader(){
    let Data = localStorage.getItem('Data');
    let DataAsString = JSON.parse(Data);
    let name = DataAsString.username;
    let nameParts = splitNames(name);
    let firstLetterName = nameParts.firstName.toUpperCase().slice(0, 1);
    let firstLetterLastname = nameParts.lastName.toUpperCase().slice(0, 1);
    initials = firstLetterName+firstLetterLastname;
    document.getElementById('initials').innerHTML = initials;
}

/**
 * Initializes certain functions once the body of the page has fully loaded.
 * @param {string} id - Id of the current navigation item which is supposed to be highlighted.
 */
async function init(id) {
    await includeHTML();
    checkLogInStatus();
    changeNavigationHighlight(id);
    lockScreenOrientation();
    gettingInitialsForHeader();
}

/**
 * Renders dynamic content in into the static html structures.
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

/**
 * Toggles a class.
 * @param {string} id - The id of the element which contains the class.
 * @param {string} classname - The name of the class to be toggled.
 */
function toggleClass(id, classname) {
    let currentUser = localStorage.getItem('Data');
    if (currentUser) {
        let currentUserAsText = JSON.parse(currentUser);
        let currentUserId = currentUserAsText.id;
        if (currentUserId === 19) {
            document.getElementById('profil').style.display = 'none';
            document.getElementById('profilBr').style.display = 'none';
        }
    }
    document.getElementById(id).classList.toggle(classname);
}

/**
 * Changes the highlighted navigation element, depending on which site you are on.
 * @param {string} id - The id of the navigation element to be highlighted.
 */
function changeNavigationHighlight(id) {
    let highlighted = document.querySelector('.active');
    highlighted.classList.remove('active');
    let newHighlighted = document.getElementById(id);
    checkIfOnHelpSite(id, newHighlighted)
}

/**
 * Checks wheter or not the help page is open.
 * @param {string} id - The id of the navigation element to be highlighted.
 * @param {element} newHighlighted - The navigation element to be highlighted.
 */
function checkIfOnHelpSite(id, newHighlighted) {
    if (newHighlighted.firstElementChild.src !== `${getProtocol()}//${getHost()}/Frontend/assets/img/question-mark-icon.png`) {
        newHighlighted.classList.add('active');
        newHighlighted.firstElementChild.src = `${getProtocol()}//${getHost()}/Frontend/assets/img/${id}-icon-white.png`;
    }
}

/**
 * Identifies the protocol method of the current site.
 * @returns The protocol method as a string.
 */
function getProtocol() {
    let protocol = window.location.protocol;
    return protocol;
}

/**
 * Identifies the host of the current site.
 * @returns The host as a string.
 */
function getHost() {
    let host = window.location.host;
    return host;
}

/**
 * Changes the url of a given image.
 * @param {string} id 
 * @param {string} url 
 */
function changeImageSource(id, url) {
    let image = document.getElementById(id);
    image.src = url;
}

/**
 * Loggs out the current user.
 */
function logOut() {
    toggleClass('profile-nav-wrapper', 'hide');
    localStorage.removeItem("Data")
}

/**
 * Redirects user to log in page to prevent unauthorized users to see protected information such as board.html for example.
 */
function checkLogInStatus() {
    if (logInCnodition()) {
        toggleClass('summary', 'hide');
        toggleClass('add-task', 'hide');
        toggleClass('board', 'hide');
        toggleClass('contacts', 'hide');
    } else if (getCurrentUsername() === '' || getCurrentUsername() === undefined) {
        window.location.replace('index.html');
    }
}

/**
 * Gets the current username from session storage.
 * @returns Item with the key "current-username" from session storage.
 */
function getCurrentUsername() {
    let currentUserData = localStorage.getItem('Data');
    let currentUserDataAsText = JSON.parse(currentUserData);    
    let currentUsernameWith_ = currentUserDataAsText.username
    let firstname = splitNames(currentUsernameWith_).firstName;
    let lastname = splitNames(currentUsernameWith_).lastName;
    let currentUsername = firstname + " " + lastname;    
    return currentUsername;
}

/**
 * This function splits the username in a first and a lastname
 * @param {*} username Username from localStorage
 * @returns obj. with first- and lastname
 */
function splitNames(username){
    let nameparts = username.split('_');
    let firstName = nameparts[0];
    let lastName = nameparts[1];
    return {firstName, lastName}
}

/**
 * Locks the screen orientation depending on which device the user is using.
 */
function lockScreenOrientation() {
    if (window.innerWidth <= 700) {
        screen.orientation.lock('portrait');
    }
}

/**
 * 
 * @returns the currentUsername
 */
function logInCnodition() {
    return getCurrentUsername() === '' && window.location.pathname === '/html/legal_notice.html' ||
        getCurrentUsername() === '' && window.location.pathname === '/html/privacy_policy.html' ||
        getCurrentUsername() === undefined && window.location.pathname === '/html/legal_notice.html' ||
        getCurrentUsername() === undefined && window.location.pathname === '/html/privacy_policy.html';
}

/**
 * This function loads userdata
 */
async function loadUserData() {
    let currentUser = localStorage.getItem('Data');
    let currentUserAsText = JSON.parse(currentUser);
    let currentUserId = currentUserAsText.id;
    let data;
    try {
        const response = await fetch(`http://127.0.0.1:8000/user/${currentUserId}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        data = await response.json();
        if (!response.ok) {
            throw new Error(`Failed to load users: ${response.status}`);
        }
    } catch (error) {
        console.error("Failed to load users from the server:", error);
    }
    editContact();
    let nameparts = data.username.split('_');
    let firstName = nameparts[0];
    let lastName = nameparts[1];
    document.getElementById('editName').value = firstName;
    document.getElementById('editLastname').value = lastName;
    document.getElementById('editEmail').value = data.email;
    document.getElementById('editPhone').value = data.phone;
    let initialIcon = document.getElementById("iconInEditContact");
    initialIcon.innerHTML = `
        <div class="circle circleInDetailView responsiveCircle" style="background-color: ${data.color};">
            ${calculateContactInitials(data.username.split("_"))}
        </div>
    `;
} //kürzen

/**
 * Calculates the contact initials based on name parts.
 * @param {Array} nameParts - The parts of the contact's name.
 * @returns {string} - The calculated initials.
 */
function calculateContactInitials(nameParts) {
    return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`;
  } // doppelt drin in contact.js

/**
 * Opens the pop-up for editing a contact.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} phone - The phone number of the contact.
 */
function editContact() {
    let container = document.getElementById('dynamicContainer');
    container.innerHTML = generateEditHTML();
    container.classList.add('dynamicContainer');
    let editContactOverlay = document.getElementById("editContactOverlay");
    let responsiveAddContactButton = document.getElementById("responsiveAddContactButton");
    responsiveAddContactButton.setAttribute('style', 'display:none !important');
    editContactOverlay.style.display = "flex";
}

/**
* Closes the pop-up.
*/
function closePopUp() {
    let editContactOverlay = document.getElementById("editContactOverlay");
    let responsiveAddContactButton = document.getElementById("responsiveAddContactButton");
    editContactOverlay.style.display = "none";
    responsiveAddContactButton.style.zIndex = "1200";
    responsiveAddContactButton.style.display = "flex";
}

/**
 * This function generates HTML-Code for editing contact
 * @returns HTML code for editing contacts
 */
function generateEditHTML() {
    return `
    <div id="responsiveAddContactButton" onclick="addContact()">
        <img src="/Frontend/assets/img/add-contact.png" alt="add contact image">
    </div>
    <div id="responsiveEditContactButton" onclick="toggleEditDeleteButtonPopUp()">
        <img src="/Frontend/assets/img/show-more.png" alt="add contact image">
    </div>
    <div id="editDeleteButtonPopUp" class="editDeleteButtonPopUp">
        <div class="contactEditButton" onclick="editContact()">
            <img class="contactDetailsNameIcons" src="/Frontend/assets/img/edit-contact.png" alt="edit contact">
            <p>Edit</p>
        </div>
        <div class="contactDeleteButton" onclick="deleteContact()">
            <img class="contactDetailsNameIcons" src="/Frontend/assets/img/delete-contact.png" alt="delete contact">
            <p>Delete</p>
        </div>
    </div>      
    <div id="editContactOverlay">
        <div id="editContactPopUp">
            <button class="closeContactButton" type="button" onclick="closePopUp()">
                <img src="/Frontend/assets/img/cancel_dark.png" alt="close icon">
            </button>
            <div class="contactLeft">
                <img class="contactPopUpImage" src="/Frontend/assets/img/join-logo.png" alt="join logo">
                <p class="contactHeadline">Edit contact</p>
                <div class="contactHeaderLine"></div>
            </div>
            <div id="iconInEditContact"></div>
            <div class="contactRight">
                <form class="contactForm" onsubmit="saveEditedContact(); return false;">
                    <div class="contactFormInput">
                        <div class="contactInputFields">
                            <input type="text" id="editName" name="name" placeholder="Name" required>
                            <img src="/Frontend/assets/img/person.png" alt="profile icon">
                        </div>
                        <div class="contactInputFields">
                            <input type="text" id="editLastname" name="name" placeholder="Lastname" required>
                            <img src="/Frontend/assets/img/person.png" alt="profile icon">
                        </div>
                        <div class="contactInputFields">
                            <input type="email" id="editEmail" name="email" placeholder="Email" required>
                            <img src="/Frontend/assets/img/mail.png" alt="email icon">
                        </div>
                        <div class="contactInputFields">
                            <input type="tel" id="editPhone" name="phone" placeholder="Phone" required>
                            <img src="/Frontend/assets/img/phone-icon.png" alt="phone icon">
                        </div>
                    </div>
                    <div class="contactFormButtons">
                        <!-- <button id="deleteButtonInForm" type="button" onclick="deleteContact()">Delete</button> -->
                        <button id="saveEditButton" type="button" onclick="saveEditedContact()">Save <img
                                src="/Frontend/assets/img/check.png" alt="confirm icon"></button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `;
}

// /**
//  * Stores data in backend.
//  * @param {string} key - The name which the data is saved with.
//  * @param {string} value - The data which is supposed to be saved.
//  */
// async function setItem(key, value) {
//     const payload = { key, value, token: STORAGE_TOKEN };
//     fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) }).then(res => res.json());
// }

// /**
//  * Sets the current username in the session storage.
//  * @param {string} username - The currently loggin in user's username.
//  */
// function setCurrentUsername(username) {
//     sessionStorage.setItem('data', username);
// }