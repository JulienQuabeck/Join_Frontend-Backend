let currentTaskFromServer;
let chosenContactsForNewTask = [];
let newSubtasksForServer = [];
let newContactsForServer = [];
let loadContactsAgain;
let editingTask;
let newPrio;
let newContacts;
let newSubtasklist;

/**
 * This function loads all tasks from the server
 * @returns tasks
 */
async function loadTasksFromServer() {
    const url = "http://127.0.0.1:8000/task/";
    let tasks = await fetch(url);
    const rawResponse = await tasks.text();
    return JSON.parse(rawResponse);
}

/**
 * This function checks if the checkbox is checked or unchecked and triggers a corresponding function 
 */
async function addContactToArray(contactId) {
    const checkbox = document.getElementById(`checkbox${contactId}`);
    const isChecked = checkbox.checked;
    let pickedContactArrayPos;
    let pickedContactValues;
    if (typeof loadedTask != "undefined") {
        await editingATask(contactId, checkbox, isChecked, pickedContactArrayPos, pickedContactValues);
    } else {
        newTaskAddContacts(contactId, checkbox, isChecked);
    }
}

/**
 * This function collects all primary keys (pks) for additing a new task
 * @param {*} chosenContactsForNewTask 
 * @returns 
 */
function getPks(chosenContactsForNewTask) {
    let pks = [];
    for (i = 0; i < chosenContactsForNewTask.length; i++) {
        +
            pks.push(chosenContactsForNewTask[i].user_id);
    }
    return pks;
}

/**
 * collects the values of all inputs
 */
async function getAllInputs(e) {
    e.preventDefault();
    let id = Math.round(Math.random() * 100);
    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let assignedTo = getPks(chosenContactsForNewTask);
    let date = document.getElementById('date').value;
    let prio = currentchosenPrio;
    let category = document.getElementById('Category').innerHTML;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        console.error("Invalid date format. Expected YYYY-MM-DD.");
        return;
    }
    const task = creatingTask(title, description, date, prio, subtasks, category, column, assignedTo);
    try {
        let tokenData = localStorage.getItem('Data');
        let tokenDataAsText = JSON.parse(tokenData);
        const token = tokenDataAsText.token;
        const response = await fetch("http://127.0.0.1:8000/task/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${token}`,
            },
            body: JSON.stringify(task),
        });
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
    } catch (error) {
        console.error("Failed to save task to the server:", error);
    }
    clearForm();
    resetAssignedTo();
}

/**
 * This function generates a new task obj.
 * @param {*} title Title of the task
 * @param {*} description description of the task
 * @param {*} date due date of the task
 * @param {*} prio prio of the task
 * @param {*} subtasks additional subtasks
 * @param {*} category category of the task
 * @param {*} column colum the task is in
 * @param {*} assignedTo all contacts which are necessary to complete the task
 * @returns 
 */
function creatingTask(title, description, date, prio, subtasks, category, column, assignedTo) {
    return {
        'title': title,
        'description': description ? description : "no description",
        'date': date,
        'priority': prio ? prio : 2,
        'subtasks': subtasks,
        'subtasksProgress': 0,
        'category': category,
        'colum': column ? column : 'todo',
        'contacts': assignedTo,
    }
}

/**
 * This function resets all assignedto checkboxes
 */
function resetAssignedTo() {
    chosenContactsForNewTask = [];
    document.getElementById('ContainerForAllChosenContacts').innerHTML = ``;
}

/**
 * This function sends the form
 * @param {*} event 
 */
async function handleFormSubmission(event) {
    try {
        event.preventDefault();
        await getAllInputs(event);
        setTimeout(() => {
            getConfirmationScreen();
        }, 2000);
    } catch (error) {
        console.error("Fehler bei der Formularverarbeitung:", error);
    }
}

/**
 * This function shows the confirmation screen for 2 sec
 */
async function getConfirmationScreen() {
    setTimeout(() => {
        confirmTheCreationOfATask();
    }, 2000);
}

/**
 * This function adds contacts to a new task
 * @param {*} contactId 
 * @param {*} checkbox 
 * @param {*} isChecked 
 */
async function newTaskAddContacts(contactId, checkbox, isChecked) {
    let contacts = await getItemContacts(checkbox);
    let contactData = contacts.find(contact => contact.user_id === contactId);
    let PosOfArray = chosenContactsForNewTask.findIndex(contact => contact.user_id === contactData.user_id);
    if (PosOfArray == -1) {
        chosenContactsForNewTask.push(contactData);
    } else {
        chosenContactsForNewTask.splice(PosOfArray, 1);
    }
}

/**
 * This function starts the task editing process
 * @param {*} contactId 
 * @param {*} checkbox 
 * @param {*} isChecked 
 * @param {*} pickedContactArrayPos 
 * @param {*} pickedContactValues 
 */
async function editingATask(contactId, checkbox, isChecked, pickedContactArrayPos, pickedContactValues) {
    try {
        if (allTasksFromServer.length != 0) { }
        else {
            allTasksFromServer = await loadTasksFromServer();
            const searchedTaskId = loadedTask.id;
            const taskNo = allTasksFromServer.findIndex(task => task.id === searchedTaskId);
            currentTaskFromServer = allTasksFromServer[taskNo];
        }
        pickedContactArrayPos = currentTaskFromServer.contacts.findIndex(contacts => String(contacts) === String(contactId));
        pickedContactValues = allTasksFromServer[pickedContactArrayPos];
        if (isChecked) {
            addChosenContact(currentTaskFromServer, contactId);
        } else {
            deleteContactFromArray(currentTaskFromServer, contactId);
        }
        currentTaskFromServer.contacts.sort();
        setNewContacts(currentTaskFromServer.contacts);
    } catch (error) {
        console.error("Fehler beim Verarbeiten des Kontakts:", error);
    }
    updateingChosenContacts(currentTaskFromServer, checkbox);
}

async function updateingChosenContacts(currentTaskFromServer, checkbox) {
    await updateChosenContacts(currentTaskFromServer);
    createCirclesToChosenContactContainer2(currentTaskFromServer);
    if (checkbox.checked == false) {
        checkbox.checked = true;
    } else {
        checkbox.checked = false;
    }
}

/**
 * This function updates all chosen contacts for a task
 * @param {*} currentTaskFromServer 
 */
async function updateChosenContacts(currentTaskFromServer) {
    let contactIds = currentTaskFromServer.contacts;
    let adress = 'ContainerForAllChosenContacts';
    let Content = document.getElementById(`${adress}`);
    Content.innerHTML = '';
    let contacts = await getItemContacts("contacts");
    for (let j = 0; j < task.contacts.length; j++) {
        let singleContact = await getSingleContact(contacts, task, j);
        creatingCircleForEdit2(singleContact, adress);
    }
    displaydiv();
}

/**
 * This function creats the circles with the initials for the contacts
 * @param {*} singleContact 
 * @param {*} adress 
 */
async function creatingCircleForEdit2(singleContact, adress) {
    let firstLetterName = gettingInitialsForEdit(singleContact).firstLetterName;
    let firstLetterLastname = gettingInitialsForEdit(singleContact).firstLetterLastname;
    let color = singleContact.color;
    document.getElementById(`${adress}`).innerHTML += `
    <div id="circle${singleContact.id}" class="circle" style="background-color:${color}">${firstLetterName}${firstLetterLastname}</div>
    `;
}

/**
 * This function updates the task in the backend
 * @param {*} id 
 * @param {*} editedTask 
 */
async function updateTask(id, editedTask) {
    try {
        let tokenData = localStorage.getItem('Data');
        let tokenDataAsText = JSON.parse(tokenData);
        const token = tokenDataAsText.token;
        const response = await fetch(`http://127.0.0.1:8000/task/${id}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${token}`,
            },
            body: JSON.stringify(editedTask),
        });
        if (!response.ok) {
            const errorDetails = await response.json();
            console.error("Server Error Details:", errorDetails);
            throw new Error(`Failed to update contact: ${response.status}`);
        }
    } catch (error) {
        console.error("Failed to update task on the server:", error);
    }
}

/**
 * Displays the edit task popup with the details of the specified task.
 * @param {string} taskId - The ID of the task to be edited.
 */
async function showEditTask(taskId) {
    let taskPosInArray = tasks.findIndex(idOfTask => idOfTask.id === taskId);
    task = tasks[taskPosInArray];
    let contacts = await getItemContacts();
    const taskPopUp = document.getElementById('pop-up');
    taskPopUp.style.display = "flex";
    taskPopUp.innerHTML = generateEditTaskHtml(task, contacts);
    handleEditPriority(task.priority);
    showSubtasksInEdit(task.id, task.subtasks);
    setNewSubtasks(task.subtasks);//evtl. wieder löschen
    createCirclesToChosenContactContainer2(task);
}

/**
 * This function creates the circles with the initials under the inputs after a contact was chosen
 */
async function createCirclesToChosenContactContainer2(task) {
    let adress = 'ContainerForAllChosenContacts';
    let Content = document.getElementById(`${adress}`);
    Content.innerHTML = '';
    let contacts = await getItemContacts("contacts");
    for (let j = 0; j < task.contacts.length; j++) {
        let singleContact = await getSingleContact(contacts, task, j);
        creatingCircleForEdit(singleContact, adress);
    }
    displaydiv();
}

/**
 * This function creates the circle at the "assigned to" Container
 * @param {int} i - the position of the contact in the Json-Array
 * @param {string} adress - carries the information about the id, where the Circle should be displayed
 */
async function creatingCircleForEdit(singleContact, adress) {
    let firstLetterName = gettingInitialsForEdit(singleContact).firstLetterName;
    let firstLetterLastname = gettingInitialsForEdit(singleContact).firstLetterLastname;
    let color = singleContact.color;
    document.getElementById(`${adress}`).innerHTML += `
    <div id="circle${singleContact.id}" class="circle" style="background-color:${color}">${firstLetterName}${firstLetterLastname}</div>
    `;
}

/**
 * This function selects the first letter of the first and the last name for the displayed circle
 * @param {int} i - the position of the contact in the Json-Array
 * @returns the first letter of the first and the last name for the displayed circle
 */
function gettingInitialsForEdit(contact) {
    let name = contact.username;
    let nameParts = name.split("_")
    let firstname = nameParts[0];
    let lastname = nameParts[1];
    firstLetterName = firstname.toUpperCase().slice(0, 1);
    firstLetterLastname = lastname.toUpperCase().slice(0, 1);
    return { firstLetterName, firstLetterLastname };
}

/**
 * This function loads a single Contact from a list of contacts
 * @param {*} contacts 
 * @param {*} task 
 * @param {*} j 
 * @returns the contact
 */
async function getSingleContact(contacts, task, j) {
    let idOfContact = task.contacts[j];
    let contact = contacts.find(contact => contact.user_id === idOfContact);
    return contact;
}

/**
 * Changes the status of a subtask and updates the task's progress.
 * @param {HTMLInputElement} status - The checkbox element representing the subtask status.
 * @param {number} subtaskId - The unique identifier of the subtask.
 * @param {number} taskId - The unique identifier of the task containing the subtask.
 */
async function changeSubtaskStatus(status, subtaskId, taskId) {
    let tasks = await loadTasksFromServer();
    let task = tasks.find(tasks => tasks.id === taskId);
    let subtaskPos = task.subtasks.findIndex(subtasks => subtasks.id === subtaskId);
    if (task.subtasks[subtaskPos].done == false) {
        task.subtasks[subtaskPos].done = true;
        task.subtasksProgress++;
    } else {
        task.subtasks[subtaskPos].done = false;
        task.subtasksProgress--;
    }
    updateTask(taskId, task);
}

/**
 * This function starts the updated process of editing a task
 * @param {*} taskToEditId 
 */
async function handleButtonClick(taskToEditId) {
    // let tasks = await loadTasksFromServer();
    // let taskToEdit = tasks.find(task => task.id === taskToEditId);
    // let oldContacts = taskToEdit.contacts;
    // if (currentTaskFromServer) {
    //     taskToEdit.contacts = [];
    //     taskToEdit.contacts = currentTaskFromServer.contacts;
    // }
    // if (newSubtasks.length > 0) {
    //     taskToEdit.subtasks = newSubtasks;
    // }
    // updateTask(taskToEdit.id, taskToEdit);
    // editTask(taskToEdit.id);
    // loadedTask = "";
    let tasks = await loadTasksFromServer();
    let taskToEdit = tasks.find(task => task.id === taskToEditId);
    let newTitle = document.getElementById('edit-title').value;
    let newDescription = document.getElementById('edit-description').value;
    let newDueDate = document.getElementById('edit-date').value;
    let newPrioNo = newPrio;
    let newContactsForTask = newContacts;//muss noch implementiert werden
    if (newContacts){
        newContactsForTask = newContacts;
    }else{
        newContactsForTask = taskToEdit.contacts;
    }
    let newSubtasksForTask = newSubtasklist;
    let newTask = {
        id: taskToEdit.id,
        title: newTitle,
        description: newDescription,
        date: newDueDate,
        priority: newPrioNo,
        category: taskToEdit.category,
        colum: taskToEdit.colum,
        contacts: newContactsForTask,
        subtasks: newSubtasksForTask,
        subtasksProgress: taskToEdit.subtasksProgress
    }
    updateTask(taskToEdit.id, newTask);
    editTask(taskToEdit.id);
    loadedTask = "";
}

/**
 * This function sets the new Prio for saving the task
 * @param {*} newPrioNo the number of the chosen prio
 */
function setNewPrio(newPrioNo) {
    newPrio = newPrioNo;
}

/**
 * This function sets the new Contacts for saving the task 
 * @param {*} newContactsFromEditTask array of all chosen Contacts
 */
function setNewContacts(newContactsFromEditTask){
    newContacts = newContactsFromEditTask;
}

/**
 * This function sets the new Subtasks for saving the task 
 * @param {*} newSubtaskList List of new Subtasks
 */
function setNewSubtasks(list){
    newSubtasklist = [];
    newSubtasklist = list;    
}




















/**
 * This function saves the subtasks to a new task
 * @param {*} subtasks 
 */
function saveSubtaskInTaskToEdit(subtasks) {
    newSubtasksForServer = subtasks;
}

/**
 * This function opens a dropdown-menu so that the user can select a contact, which should work at the task in the future
 * @param {string} id - id of the Element which should be flipped around 
 */
async function getAllContacts() {
    flipTheImage();
    displayContacts();
    generateContactsContainer();
    putAssignedToInForeground();
    checkIfCheckboxesWereChecked();
    checkScreenWidth();
}

/**
 * This function checks, if a checkbox was checked, if so it will be checked after reopening the dropdown-menu
 */
function checkIfCheckboxesWereChecked(firstloadedContacts) {
    if (typeof task != "undefined") {
        for (let j = 0; j < task.contacts.length; j++) {
            if (currentTaskFromServer) {
                task.contacts = currentTaskFromServer.contacts;
            }
            let id = task.contacts[j];
            document.getElementById(`checkbox${id}`).checked = true;
        }
    }
    if (chosenContactsForNewTask.length > 0 && loadContactsAgain == true && firstloadedContacts == true) {
        for (let i = 0; i < chosenContactsForNewTask.length; i++) {
            checkbox = `checkbox${chosenContactsForNewTask[i].user_id}`;
            document.getElementById(checkbox).checked = true;
        }
        loadContactsAgain = false;
        firstloadedContacts = false;
    }
}

/**
 * This function checks, if a checkbox was already checked
 */
function checkIfCheckboxesWereChecked2() {
    if (chosenContactsForNewTask.length > 0 && loadContactsAgain == true) {
        for (let i = 0; i < chosenContactsForNewTask.length; i++) {
            checkbox = `checkbox${chosenContactsForNewTask[i].id}`;
            document.getElementById(checkbox).checked = true;
        }
        loadContactsAgain = false;
    }
}

/**
 * This function closes / hides all Containers which belong to the "Assigned To" Area
 */
function closecontacts() {
    document.getElementById('assignedToSelect').value = '';
    document.getElementById('overlayContacts').classList.toggle('d-none');
    document.getElementById('assignedToImg').src = "/Frontend/assets/img/arrow_up.png"
    document.getElementById('ContainerForAllPossibleContacts').innerHTML = '';
    document.getElementById('ContainerForAllPossibleContacts').classList.add('d-none');
    loadContactsAgain = true;
    getContactsfromNewTask();
    document.getElementById('assignedToSelect').setAttribute('z-index', '0');
    document.getElementById('ContainerForAllPossibleContacts').setAttribute('z-index', '0');
    checkScreenWidth();
}

/**
 * This function loads the contacts of a new task
 */
async function getContactsfromNewTask() {
    document.getElementById('ContainerForAllChosenContacts').classList.remove('d-none');
    let adress = 'ContainerForAllChosenContacts';
    let Content = document.getElementById(`${adress}`);
    Content.innerHTML = '';
    if (chosenContactsForNewTask.length != 0) {
        for (let j = 0; j < chosenContactsForNewTask.length; j++) {
            creatingCircleForEdit(chosenContactsForNewTask[j], adress);
        }
    }
    else {
        for (let j = 0; j < currentTaskFromServer.contacts.length; j++) {
            contacts = await getItemContacts();
            let contactData = contacts.find(contact => contact.user_id === currentTaskFromServer.contacts[j]);
            creatingCircleForEdit(contactData, adress);
        }
    }
}

/**
 * Handles the search functionality as the user types, filtering tasks based on the entered search term.
 * @param {Event} e - The input event object.
 */
async function searchByLetter(e) {
    const searchInput = document.getElementById('search-text');
    const search_term = e.target.value.toLowerCase();
    let tasks = await loadTasksFromServer()
    const searchedTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(search_term)
    );
    clearAllColumns();
    renderTasks(searchedTasks);
}

/**
 * This function checks if a User is already Logged in
 */
function checkIfUserIsLoggedIn() {
    let loggedIn = localStorage.getItem("Data");
    if (!loggedIn) {
        window.location.href = 'index.html';
    }
}