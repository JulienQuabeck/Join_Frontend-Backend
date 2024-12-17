/**
 * Initializes certain functions once the body of the page has fully loaded.
 */
async function initContacts() {
  checkIfUserIsLoggedIn();
  checkLogInStatus();
  await init('contacts');
  await loadUsers();
  //await loadContactsFromServer();
  renderContactBook();
}


/**
 * Renders contact overview section
 */
function renderContactBook() {
  let contactOverview = document.getElementById("contactOverviewContent");
  let currentAlphabetLetter = null;

  contactOverview.innerHTML = "";
  // contactOverview.innerHTML = renderAddContactButton();

  sortContactsAlphabetically();

  for (let i = 0; i < contacts.length; i++) {
    let contact = contacts[i];
    let contactFirstLetter = contact.username.charAt(0).toUpperCase();
    handleLetterChange(currentAlphabetLetter, contactFirstLetter, contactOverview);
    currentAlphabetLetter = contactFirstLetter;

    let circleStyle = `background-color: ${contact.color};`;
    let circleClass = `circle-${contact.username.charAt(0).toUpperCase()}`;
    let nameParts = contact.username.split("_");
    let firstName = nameParts[0];
    let lastName = nameParts[1];
    let contactInitials = calculateContactInitials(nameParts);

    renderContactItem(contactOverview, circleStyle, circleClass, contactInitials, contact, i, firstName, lastName);
  }

  handleLastLetter(currentAlphabetLetter, contactOverview);
}


/**
 * Sorts the contacts alphabetically based on the name.
 *
 * @returns {Array} - The sorted contacts.
 */
function sortContactsAlphabetically() {
  return contacts.sort((a, b) => a.username.localeCompare(b.username));
}


/**
 * Handles changes in the current group and renders the new group header if needed.
 *
 * @param {string} currentAlphabetLetter - The current letter group.
 * @param {string} newLetter - The new letter group.
 * @param {HTMLElement} contactOverview - The element where contacts are rendered.
 */
function handleLetterChange(currentAlphabetLetter, newLetter, contactOverview) {
  if (newLetter !== currentAlphabetLetter) {
    openLetterGroup(newLetter, contactOverview);
  } else {
    closeLetterGroup(contactOverview);
  }
}


/**
 * Calculates the contact initials based on name parts.
 *
 * @param {Array} nameParts - The parts of the contact's name.
 * @returns {string} - The calculated initials.
 */
function calculateContactInitials(nameParts) {
  return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`;
}


/**
 * Handles the last group and closes it if needed.
 *
 * @param {string} currentAlphabetLetter - The current name group.
 * @param {HTMLElement} contactOverview - The element where contacts are rendered.
 */
function handleLastLetter(currentAlphabetLetter, contactOverview) {
  if (currentAlphabetLetter !== null) {
    closeLetterGroup(contactOverview);
  }
}


/**
 * Shows contact details and renders them in the 'contactDetailsView' div.
 *
 * @param {string} contactItemId - The ID of the contact item.
 * @param {boolean} toEdit - True, wenn der Bearbeitungsmodus aktiviert ist.
 */
function showContactDetails(contactItemId, toEdit) {
  toggleSelectedClass(contactItemId);

  let sortedIndex = parseInt(contactItemId.split('_')[1]);
  let selectedContact = sortContactsAlphabetically()[sortedIndex];

  renderContactDetails(selectedContact, toEdit);

  if (window.innerWidth <= 695) {
    document.getElementById("contactOverview").setAttribute('style', 'display:none !important');
    document.getElementById("contactPageRightHeader").setAttribute('style', 'display:none');
    document.getElementById("contactPageRightHeaderResponsive").setAttribute('style', 'display:flex');
    document.getElementById("contactDetailsView").setAttribute('style', 'display:flex !important');
    document.getElementById("responsiveAddContactButton").setAttribute('style', 'display:none !important');
    document.getElementById("responsiveEditContactButton").setAttribute('style', 'display:flex !important');
    document.querySelector(".contactEditButton").setAttribute('style', 'display:none !important');
    //document.querySelector(".contactDeleteButton").setAttribute('style', 'display:none !important');
    document.getElementById("responsiveContactDetailBack").setAttribute('style', 'display:flex');
  }
}


/**
 * Toggles the 'selectedContact' class for the clicked contact item and
 * handles the corresponding actions like displaying or hiding contact details.
 *
 * @param {string} contactItemId - The ID of the contact item.
 */
function toggleSelectedClass(contactItemId) {
  let clickedItem = document.getElementById(contactItemId);
  let contactDetailsView = document.getElementById("contactDetailsView");
  let isSelected = clickedItem.classList.toggle("selectedContact");

  if (isSelected) {
    showSelectedContactDetails(clickedItem);
  } else {
    hideContactDetails(contactDetailsView);
  }

  unselectOtherContactItems(clickedItem);
}


/**
 * Shows details of the selected contact.
 *
 * @param {HTMLElement} clickedItem - The clicked contact item.
 */
function showSelectedContactDetails(clickedItem) {
  let sortedIndex = parseInt(clickedItem.id.split('_')[1]);
  let selectedContact = sortContactsAlphabetically()[sortedIndex];
  renderContactDetails(selectedContact);
  document.getElementById("contactDetailsView").style.display = "flex";
}


/**
 * Hides the contact details view.
 *
 * @param {HTMLElement} contactDetailsView - The contact details view element.
 */
function hideContactDetails(contactDetailsView) {
  contactDetailsView.style.display = "none";
}

/**
 * Unselects the 'selectedContact' class from other contact items.
 *
 * @param {HTMLElement} clickedItem - The clicked contact item.
 */
function unselectOtherContactItems(clickedItem) {
  let contactItems = document.querySelectorAll(".contactItem");
  contactItems.forEach(item => {
    if (item !== clickedItem) {
      item.classList.remove("selectedContact");
    }
  });
}


/**
 * closes contact detail view and returns to contact book when viewed on mobile device
 * 
 */
function returnToContactBook() {
  let contactOverview = document.getElementById("contactOverview");
  let contactPageRightHeaderResponsive = document.getElementById("contactPageRightHeaderResponsive");
  let contactDetailsView = document.getElementById("contactDetailsView");
  let responsiveContactDetailBack = document.getElementById("responsiveContactDetailBack");
  let responsiveAddContactButton = document.getElementById("responsiveAddContactButton");
  let responsiveEditContactButton = document.getElementById("responsiveEditContactButton");
  let editDeleteButton = document.getElementById("editDeleteButtonPopUp");

  contactOverview.setAttribute('style', 'display:flex !important');
  contactPageRightHeaderResponsive.setAttribute('style', 'display:none');
  contactDetailsView.style.display = "none";
  responsiveContactDetailBack.style.display = "none";
  responsiveAddContactButton.style.display = "flex";
  responsiveEditContactButton.style.display = "none";
  editDeleteButton.style.display = "none";

  renderContactBook();
}


/**
 * Opens the pop-up for adding a new contact.
 * 
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} phone - The phone number of the contact.
 */
function addContact() {
  let addContactOverlay = document.getElementById("addContactOverlay");
  let name = document.getElementById("name");
  let email = document.getElementById("email");
  let phone = document.getElementById("phone");
  let responsiveButton = document.getElementById("responsiveAddContactButton");

  name.value = "";
  email.value = "";
  phone.value = "";

  responsiveButton.style.zIndex = "-200";
  addContactOverlay.style.display = "flex";

  addContactOverlay.addEventListener("click", function (event) {
    if (event.target === addContactOverlay) {
      closePopUp();
    }
  });
}


/**
 * Closes the pop-up.
 */
function closePopUp() {
  let addContactOverlay = document.getElementById("addContactOverlay");
  let editContactOverlay = document.getElementById("editContactOverlay");
  let responsiveAddContactButton = document.getElementById("responsiveAddContactButton");

  addContactOverlay.style.display = "none";
  editContactOverlay.style.display = "none";
  responsiveAddContactButton.style.zIndex = "1200";
  responsiveAddContactButton.style.display = "flex";
}


/**
 * Function for adding new contact
 */
async function createContact() {
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let phone = document.getElementById("phone").value;
  let saveButton = document.getElementById("saveButton");

  createLoadingAnimation(saveButton);

  setTimeout(async function () {
    let newContact = {
      Name: name,
      email: email,
      phone: phone,
      color: generateRandomColor(),
    };
    saveContactsToServer(newContact)
  }, 1000);
}




/**
 * Adds a new contact to the contacts array and renders the contact book.
 *
 * @param {Object} newContact - The new contact to be added.
 */
async function addContactAndRender(newContact) {
  await contacts.push(newContact);
  await setItemContacts("contacts", JSON.stringify(contacts));
  await renderContactBook();
}


/**
 * Finds the index of a contact in the sorted contacts array.
 *
 * @param {Object} contactToFind - The contact to find in the array.
 * @returns {number} - The index of the contact in the sorted array.
 */
function findContactIndex(contactToFind) {
  let sortedContacts = sortContactsAlphabetically();
  return sortedContacts.findIndex(contact =>
    contact.Name === contactToFind.name && contact.email === contactToFind.email && contact.phone === contactToFind.phone
  );
}


/**
 * Generates a random hex color.
 * @returns {string} - Random hex color.
 */
function generateRandomColor() {
  let randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
  return randomColor;
}


/**
 * Displays a confirmation message and hides it.
 */
function showConfirmationMessage() {
  let confirmationMessage = document.getElementById("confirmationMessage");
  confirmationMessage.style.display = "flex";

  setTimeout(function () {
    confirmationMessage.style.display = "none";
  }, 1500);
}


/**
 * Closes the pop-up and shows the confirmation message.
 */
function closePopUpWithConfirmation() {
  showConfirmationMessage();
  closePopUp();
}


/**
 * Opens the pop-up for editing a contact.
 * 
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} phone - The phone number of the contact.
 */
function editContact() {
  let editContactOverlay = document.getElementById("editContactOverlay");
  let responsiveAddContactButton = document.getElementById("responsiveAddContactButton");

  responsiveAddContactButton.setAttribute('style', 'display:none !important');
  editContactOverlay.style.display = "flex";
}


/**
 * Saves the edited contact information, updates the contact book, and shows the edited contact details.
 */
async function saveEditedContact() {
  let editedName = document.getElementById("editName").value;
  let editedLastname = document.getElementById("editLastname").value;
  let editedEmail = document.getElementById("editEmail").value;
  let editedPhone = document.getElementById("editPhone").value;
  let selectedContactItem = document.querySelector(".selectedContact");
  let index = parseInt(selectedContactItem.id.split('_')[1]);
  let id = contacts[index].user_id
  let updatedContact = {
    username: `${editedName}_${editedLastname}`,
    email: editedEmail,
    phone: editedPhone,
    color: contacts[index].color
  }
  let saveEditButton = document.getElementById("saveEditButton");
  createLoadingAnimation(saveEditButton);
  try {
    const response = await fetch(`http://127.0.0.1:8000/user/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedContact),
    });
    console.log(JSON.stringify(updatedContact));
    
    if (!response.ok) {
      throw new Error(`Failed to update contact: ${response.status}`);
    }
    //const updatedContactFromServer = await response.json();
    // contacts[index] = updatedContactFromServer;
    contacts[index] = updatedContact;
    //console.log("Contact successfully updated:", updatedContactFromServer);
  } catch (error) {
    console.error("Failed to update contact on the server:", error);
  }
  // await setItemContacts("contacts", JSON.stringify(contacts));
  closePopUp();
  debugger
  renderContactBook();
  showContactDetails(selectedContactItem.id);
  resetSaveButton(saveEditButton);
}

/**
 * Deletes the selected contact, updates the contacts array, and re-renders the contact book.
 */
async function deleteContact() {
  let selectedContactItem = document.querySelector(".selectedContact");
  let detailView = document.getElementById("contactDetailsView");
  let editDeleteButton = document.getElementById("editDeleteButtonPopUp");

  if (selectedContactItem) {
    let contactItemId = selectedContactItem.id;
    let index = parseInt(contactItemId.split('_')[1]);
    let contact_id = contacts[index].id
    try {
      const response = await fetch(`http://127.0.0.1:8000/contact/${contact_id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to delete contact: ${response.status}`);
      }
      console.log("Contact successfully deleted");
    } catch (error) {
      console.error("Failed to update contact on the server:", error);
    }
    await setItemContacts("contacts", JSON.stringify(contacts));
  }
}


/**
 * shows edit and delete contact button in responsive mode and hides it
 * 
 */
function toggleEditDeleteButtonPopUp() {
  let popUp = document.getElementById('editDeleteButtonPopUp');
  popUp.style.display = (popUp.style.display === 'block') ? 'none' : 'block';
}