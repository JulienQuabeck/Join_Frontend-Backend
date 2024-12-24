/**
 * Generates HTML content for the task pop-up.
 * @returns {string} - The HTML string representing the task pop-up content.
 */ 
async function generateTaskHtml(task) {
    let contactData = await loadContacts();  
    let contactsHtmlArray = await Promise.all(task.contacts.map(contact_id => generateContactHtml(contact_id, contactData)));
    let contactsHtml = contactsHtmlArray.join('');   
    let subtasksHtmlArray = await Promise.all(task.subtasks.map(subtask => generateSubtaskHtml(subtask, task.id)));
    let subtasksHtml = subtasksHtmlArray.join('');
    let priorityText = generatePriorityText(task.priority);
    let priorityIcon = generatePriorityIcon(task.priority);
    return /*html*/ `
        <div class="pop-up-task-container" onclick="stopPropagation(event)">
            <div class="pop-up-task-header">
                <button class="pop-up-label">${task.category}</button>
                <button class="pop-up-close-button" onclick="closeTask('pop-up')">
                    <img src="/Frontend/assets/img/board/close-task.svg" alt="Close">
                </button>
            </div>        
            <div class="pop-up-task-title">
                <h2>${task.title}</h2>
            </div>
            <div class="pop-up-task-subtitle">
                <p>${task.description}</p>
            </div>
            <div class="pop-up-task-date">
                <span>Due date:</span>
                <span>${new Date(task.date).toISOString().split('T')[0]}</span>
            </div>
            <div class="pop-up-task-priority">
                <span>Priority:</span>
                <button class="pop-up-task-priority-button">
                    <span>${priorityText}</span>
                    ${priorityIcon}
                </button>
            </div>
            <div class="pop-up-task-contacts-container">
                <p>Assigned to:</p>
                <div class="pop-up-task-contacts${task.id} pop-up-task-contacts">
                    ${contactsHtml}
                </div>
            </div>          
            <div class="pop-up-task-subtasks-container">
                <p>Subtasks:</p>
                <div class="pop-up-task-subtasks">
                    ${subtasksHtml}
                </div>
            </div>  
            <div class="pop-up-task-footer">
                <button onclick="confirmDeleteTask(${task.id})">
                    <img src="/Frontend/assets/img/board/pop-up-footer-delete.svg" alt="">
                    <span>Delete</span>
                </button>
                <img src="/Frontend/assets/img/board/pop-up-footer-vector 3.svg" alt="">
                <button onclick="showEditTask(${task.id})">
                    <img src="/Frontend/assets/img/board/pop-up-footer-edit.svg" alt="">
                    <span>Edit</span>
                </button>
            </div>
        </div>
    `;
}

/**
 * This function loads a single contact
 * @param {*} id 
 * @returns 
 */
async function loadSingleContacts(id){
    const url = `http://127.0.0.1:8000/contact/${id}/`
    try{
    let ServerContacts = await fetch(url);
    if(!ServerContacts.ok){
        throw new Error (`HTTP-FEHLER: ${serverContacts.status}`)
    }
    const rawResponse = await ServerContacts.text();
    return JSON.parse(rawResponse);
    }
    catch(err) {
            console.warn('no contact with id: ', i, err)
    }
  }
  
/**
 * Generates HTML for the task editing popup.
 * @param {Object} taskToEdit - The task object being edited.
 * @returns {string} - HTML markup for the task editing popup.
 */
function generateEditTaskHtml(taskToEdit, contacts) { // diese Funktion nicht async machen!!
    taskToEdit = taskToEdit;
    return /*html*/`
        <div class="pop-up-task-container" onclick="stopPropagation(event)">
            <div class="edit-close-button-container">
                <button class="pop-up-close-button" onclick="closeTask('pop-up')">
                    <img src="/Frontend/assets/img/board/close-task.svg" alt="Close">
                </button>
            </div>
            <div class="edit-title-container">
                <span>Title</span>
                <input type="text" id="edit-title" placeholder="Enter Title" name="title" value="${taskToEdit.title}">
            </div>
            <div class="edit-description-container">
                <span>Description</span>
                <textarea id="edit-description" placeholder="Enter Description" name="description" rows="4" cols="30">${taskToEdit.description}</textarea>
            </div>
            <div class="edit-date-container">
                <span>Due date</span>
                <input value="${new Date(taskToEdit.date).toISOString().split('T')[0]}" min="${new Date().toISOString().split('T')[0]}" type="date" id="edit-date" name="date">
            </div>
            <div class="edit-priority-container">
                <span>Priority</span>
                <div class="edit-priority-buttons">
                    <button id="urgent" onclick="changePriority(1)">
                        <span>Urgent</span>
                        <img id="edit-urgent-img" src="/Frontend/assets/img/board/prio-urgent.svg" alt="">
                    </button>
                    <button id="medium" onclick="changePriority(2)">
                        <span>Medium</span>
                        <img id="edit-medium-img" src="/Frontend/assets/img/board/prio-medium.svg" alt="">
                    </button>
                    <button id="low" onclick="changePriority(3)">
                        <span>Low</span>
                        <img id="edit-low-img" src="/Frontend/assets/img/board/prio-low.svg" alt="">
                    </button>
                </div>
            </div>
            <div class="edit-assign-container">
                <label>Assignet to:</label>
                <div id="SubcontentContacts" class="Subcontent">
                    <div class="assignedToContainerInput assignedToContainerInputEdit" onclick="getAllContacts2('assignedToSelect')">
                        <input id="assignedToSelect" class="selection hover arrowdown" autocomplete="off"
                            placeholder="Select contacts to assign" onkeyup="filterContacts()"><img
                            id="assignedToImg" class="arrow" src="/Frontend/assets/img/arrow_up.png">
                    </div>
                    <div id="ContainerForAllChosenContacts" class="ContainerForAllChosenContacts d-none">
        TEST
                    </div>
                    <div id="ContainerForAllPossibleContacts" class="ContainerForAllPossibleContacts hover d-none">
                    ${taskToEdit.contacts}
                    </div>
                    <div id="overlayContacts" class="overlay d-none" onclick="closecontacts()"></div>
                </div>
            </div>
            <div class="edit-subtasks-container">
                <form onsubmit="addSubtaskInEdit(event, ${taskToEdit.id})">
                    <input id="subtask-text" type="text" minlength="3" required placeholder="add new subtask">
                    <button type="submit" class="add-subtask-btn">
                        <img src="/Frontend/assets/img/board/subtask-plus.svg" alt="">
                    </button>
                </form>
                <ul class="edit-subtask-list"></ul>
            </div>
            <div id="buttonContainer" class="edit-button-container">
                <button id="edit-button" onclick="handleButtonClick(${taskToEdit.id})">
                    <span>OK</span>
                    <img src="/Frontend/assets/img/board/check.svg" alt="">
                </button>
            </div>
        </div>
    `;
}

/**
 * Generates HTML for an edit contact and returns it as a string.
 * @param {Object} contact - The contact object.
 * @returns {string} - The HTML string for the edit contact.
 */
function generateEditContactHtml(contact) {
    return /*html*/ `<div class="edit-contact" style="background-color: ${contact.color};">${contact.name[0]}${contact.lastName[0]}</div>`;
}

/**
 * Generates HTML for a contact in the pop-up task details.
 * @param {Object} contact - The contact object containing information.
 * @returns {string} - The HTML string representing the contact.
 */
async function generateContactHtml(contact_id, contactData) {  
    let singleContact = contactData.find(contactData => contactData.user_id === contact_id); 
    let name = singleContact.username;
    let nameparts = name.split('_');
    let firstname = nameparts[0];
    let lastname = nameparts[1];
    let firstnameLetter = gettingInitials(firstname);
    let lastnameLetter = gettingInitials(lastname);
    return  /*html*/ `
        <div class="pop-up-task-contact">
            <div class="contact-label" style="background:${singleContact.color};">${firstnameLetter}${lastnameLetter}</div>
            <div class="contact-name">${firstname} ${lastname}</div>
        </div>`;
}

/**
 * This function loads all users
 * @returns all users
 */
async function loadContacts(){
    const url = `http://127.0.0.1:8000/user/`;
    let ServerContacts = await fetch(url);
    const rawResponse = await ServerContacts.text();
    return JSON.parse(rawResponse);
}

/**
 * Generates HTML for a subtask in the pop-up task details.
 * @param {Object} subtask - The subtask object containing information.
 * @returns {string} - The HTML string representing the subtask.
 */
async function generateSubtaskHtml(subtask, taskId) {
    return  /*html*/ `
        <div class="pop-up-task-subtask">
            <input type="checkbox" onchange="changeSubtaskStatus(this, ${subtask.id}, ${taskId})" ${subtask.done ? 'checked' : ''} >
            <span>${subtask.name}</span>
        </div>`;
}

/**
 * Generates the HTML for a task card.
 * @param {string} cardId - The unique identifier for the card.
 * @param {Object} task - The task object containing information to be displayed on the card.
 * @returns {string} - The HTML string representing the task card.
 */
function generateCardHtml(cardId, task) {
    let priorityIcon = generatePriorityIcon(task.priority);
    if (task) {
        return /*html*/ `
        <div class="card-container" onclick="openTask(${task.id})" draggable="true" ondragstart="startDragging(${getTaskIndex(task.id)})" id="${cardId}">
        <div class="card">
            <button class="card-label">${task.category}</button>
                <h3 class="card-title">${task.title}</h3>
                <p class="card-content">${task.description}</p>
                <div id="progress" class="progress-bar-container ${task.subtasks?.length <= 0 ? 'hide' : ''}">
                    <div class="progress-bar">
                        <div class="progress-done" id="progress${task.id}"></div>
                    </div>
                    <p class="subtasks-container">${task.subtasksProgress}/${task.subtasks.length} Subtasks</p>
                </div>
                <div class="card-footer">
                    <div class="profiles" id="tasksProfiles${task.id}"></div>
                    <div class="priority-container">
                        ${priorityIcon}
                    </div>
                </div>
            </div>
        </div>
            
    `;
    }
}

/**
 * Generates a textual representation of priority based on numerical values.
 * @param {number} priority - The numerical priority value (1, 2, or 3).
 * @returns {string} - The corresponding priority text ('Urgent', 'Medium', or 'Low').
 */
function generatePriorityText(priority) {
    switch (priority) {
        case 3:
            return 'Low';
        case 2:
            return 'Medium';
        case 1:
            return 'Urgent';
        default:
            return 'Unknown Priority';
    }
}

/**
 * Generates HTML for a priority icon based on the specified priority level.
 * @param {string} priority - The priority level ('Low', 'Medium', or 'Urgent').
 * @returns {string} - The HTML string representing the priority icon.
 */
function generatePriorityIcon(priority) {
    switch (priority) {
        case 3:
            return /*html*/`<img src="/Frontend/assets/img/board/prio-low.svg" alt="Priority Icon">`;
        case 2:
            return /*html*/`<img src="/Frontend/assets/img/board/prio-medium.svg" alt="Priority Icon">`;
        case 1:
            return /*html*/`<img src="/Frontend/assets/img/board/prio-urgent.svg" alt="Priority Icon">`;
    }
}

/**
 * Generates HTML for editing the text of a subtask.
 * @param {string} taskId - The ID of the task.
 * @param {string} subtaskId - The ID of the subtask.
 * @param {string} text - The current text of the subtask.
 * @returns {string} - HTML for editing the subtask text.
 */
function generateEditSubtaskTextHtml(taskId, subtaskId, text) {
    return /*html*/ `
        <input type="text" id="edit-subtask-text-input" value="${text}">
        <div class="edit-subtask-text-icons">
            <button onclick="deleteSubtask('${taskId}', '${subtaskId}')">
                <img src="/Frontend/assets/img/board/delete-subtask-icon.svg" alt="Delete Icon">
            </button>
            <button onclick="editSubtaskText('${taskId}', '${subtaskId}')">
                <img src="/Frontend/assets/img/board/check-edit-subtask.svg" alt="Check Icon">
            </button>
        </div>
    `;
}

/**
 * Generates the HTML for a no tasks card.
 * @returns {string} - The HTML string representing the container.
 */
function generateNoTaskHtml() {
    return /*html*/ `
        <div class="no-task-card-container">
            <h3>No tasks</h3>
        </div>
    `;
}