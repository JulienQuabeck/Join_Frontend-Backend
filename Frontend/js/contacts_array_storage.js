contacts = [];


/**
 * Stores data on the server using the specified key.
 *
 * @param {string} key - The key under which the data will be stored.
 * @param {string} value - The data to be stored.
 * @returns {Promise} - A promise that resolves to the server response in JSON format.
 */
async function setItemContacts(key, value) {
  const payload = { key, value, token: STORAGE_TOKEN };
  return fetch(STORAGE_URL, { method: "POST", body: JSON.stringify(payload) }).then((res) => res.json());
}

/**
* Saves a new contact to the server and updates the local 'contacts' array.
*
* @param {Object} newContact - The contact object to be saved.
*/
async function saveContactsToServer(newContact) {
  // push für den server einbauen
  try {
    // POST request to your Django backend
    const response = await fetch("http://127.0.0.1:8000/contact/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newContact),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const savedContact = await response.json();

    // Update the local contacts array with the newly saved contact
    contacts.push(savedContact);

    console.log("Contact successfully saved to the server:", savedContact);
  } catch (error) {
    console.error("Failed to save contact to the server:", error);
  }
  // contacts.push(newContact);
  // await setItemContacts("contacts", JSON.stringify(contacts));
}

/**
* Retrieves data from the server using the specified key.
*
* @param {string} key - The key for which data is to be retrieved.
* @returns {Promise} - A promise that resolves to the retrieved data value from the server.
*/
async function getItemContacts(checkbox) {
  // const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  // return fetch(url).then((res) => res.json()).then((res) => res.data.value);
  // if(typeof checkbox != "undefined"){
  //   checkbox.disabled = true;
  // }
  let checkboxStatus;
  
  if (typeof checkbox != "undefined"){
    if (checkbox.checked == true) {
      checkboxStatus = true;
    }
  }
  const url = "http://127.0.0.1:8000/contact/";
  let ServerContacts = await fetch(url);
  const rawResponse = await ServerContacts.text();
  if (typeof checkbox != "undefined") {
    checkbox.checked = checkboxStatus;
  }
  return JSON.parse(rawResponse);

}

/**
* Loads contacts from the server and updates the local 'contacts' array.
*/
async function loadContactsFromServer() {
  try {
    contacts = await getItemContacts("contacts");
  } catch (e) {
    console.error("Loading error:", e);
  }
}
