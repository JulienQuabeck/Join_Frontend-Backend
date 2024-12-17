let currentchosenPrio; // needed in function "changeItoPrioInString" to see which Prio was chosen
let subtasks = [];

/**
 * Initializes certain functions once the body of the page has fully loaded.
 */
async function initAddTask() {
    checkIfUserIsLoggedIn();
    await init('add-task');
    minDate();
    choosePrio(2);
    await loadContactsFromServer();    
}

/** changes the HTML back to standard (=no Prio chosen)
 * 
 */
function resetPrio() {
    firstloadedContacts = false;
    document.getElementById('SubcontentPrio').innerHTML = `
        <div id="Prio1" class="prioclass hover" onclick="choosePrio(1)">
            <div>Urgent</div>
            <img id="HighImg" src="/Frontend/assets/img/PrioHigh.png">
        </div>
        <div id="Prio2" class="prioclass hover" onclick="choosePrio(2)">
            <div>Medium</div>
            <img id="MediumImg" src="/Frontend/assets/img/PrioMedium.png">
        </div>
        <div id="Prio3" class="prioclass hover" onclick="choosePrio(3)">
            <div>Low</div>
            <img id="LowImg" src="/Frontend/assets/img/PrioLow.png">
        </div>
    `;
}

/**
 * 
 * @param {string} Prio - changes the given number i to a Prioity in string-form
 * @param {int} i - gives the function the Prio in int (1 = Urgent / 2 = Medium / 3 = Low Priority)
 * @param {int} currentchosenPrio - safe the current chosen Priority in int (like above)
 */
function changeItoPrioInString(Prio, i) {
        if (i == 1) {
            Prio = 'High';
        } else if (i == 2) {
            Prio = 'Medium';
        } else {
            Prio = 'Low';
        }
        currentchosenPrio = i;
        changeColorOfPrio(Prio, i);
    }

/** Reset the HTML and changes the color and the image for the chosen Prio
 * 
 * @param {int} i - gives the function the Prio in int (1 = Urgent / 2 = Medium / 3 = Low Priority)
 */
function choosePrio(i) {
    resetPrio();
    let Prio;
    changeItoPrioInString(Prio, i);
}

/** changes the img for the chosen Prio
 * 
 * @param {string} Prio - safes the chosen Priority in string-form
 */
function changeImgOfPrio(Prio) {
    let img2 = `/Frontend/assets/img/Prio${Prio}White.png`;
    document.getElementById(`${Prio}Img`).src = img2;
}

/**changes the backgroundcolor of the Prio-div
 * 
 * @param {string} Prio - changes the given number i to a Prioity in string-form
 * @param {int} i - gives the function the Prio in int (1 = Urgent / 2 = Medium / 3 = Low Priority)
 */
function changeColorOfPrio(Prio, i) {
    document.getElementById(`Prio${i}`).classList.toggle(`${Prio}chosen`);
    changeImgOfPrio(Prio);
}

/**
 * This function toggles the Images from the Subtask Input
 */
function activateAndDeactivateSubtaskInput() {
    toggleSubtaskImg();
}

/**
 * This function toggles all Images of the Subtask-Input
 */
function toggleSubtaskImg() {
    toggleClass('plus', 'd-none');
    toggleClass('cancel', 'd-none');
    toggleClass('verticalLine', 'd-none');
    toggleClass('hook', 'd-none');
    toggleClass('overlay', 'd-none');
}

/**
 * This function clears the Subtasks Input
 */
function cancelSubtask() {
    document.getElementById('subtask').value = '';
}

/**
 * This function adds a new subtask to the Array "subtasks"
 */
function addSubtask() {
    let task = document.getElementById('subtask').value;
    if (task.length == 0) {
    } else {
        let taskJSON = {
            'id': Math.round(Math.random() * 100),
            'name': task,
            'done': false
        }
        if (subtasks.length >= 2) {
            document.getElementById('subTaskList').setAttribute('style', "overflow-y:scroll");
        }
        document.getElementById('buttons').setAttribute('style', "margin-top:0");
        subtasks.push(taskJSON);
        showSubtasksafterAddingATask();
        if (subtasks.length != 0){
            document.getElementById('buttonsAndInfotext').style.marginTop = "150px";
        }
    }
}

/**
 * This function generates and displays the Content of the Array "subtasks"
 */
function showSubtasks() {
    let subtasksList = document.getElementById('subTaskList');
    subtasksList.innerHTML = '';
    for (let i = 0; i < subtasks.length; i++) {
        subtasksList.innerHTML += `<li>${subtasks[i]['name']} <div class="subtaskContainerEdit"><img class="hover" src="/Frontend/assets/img/edit-contact.png" onclick="editSubtask(${i})"></img> <img class="hover" onclick="deleteSubtaskInEdit(${i})" src="/Frontend/assets/img/delete-contact.png"></div> </li>`;
    }
}


/**
 * Befüllt das Subtask-Formular mit den Informationen des ausgewählten Subtasks und löscht ihn anschließend aus der Bearbeitungsliste.
 *
 * @param {number} i - Der Index des ausgewählten Subtasks.
 */
function editSubtask(i) {
    document.getElementById('subtask').value = subtasks[i]['name'];
    deleteSubtaskInEdit(i);
}


/**
 * This functions starts the Subtask adding process
 */
function showSubtasksafterAddingATask() {
    showSubtasks();
    activateAndDeactivateSubtaskInput();
    cancelSubtask();
}

/**
 * This function deletes a Subtasks from Array "subtasks" and displays the Array afterwards
 * @param {int} i - id of the Subtasks
 */
function deleteSubtaskInEdit(i) {
    subtasks.splice(i, 1);
    if (subtasks.length <= 2) {
        document.getElementById('subTaskList').setAttribute('style', "overflow-y:hidden");
    }
    showSubtasks();
    if (subtasks.length == 0){
        document.getElementById('buttonsAndInfotext').style.marginTop = "20px";
    }
}

async function collectAllPk(chosenContactsJson){
    pks= []
    for (i = 0; i < chosenContactsJson.length; i++){
        pk = chosenContactsJson[i]['id'];
        pks.push(pk)
    }
    return pks
}

/**
 * limits the possible Dates which can be chosen
 */
function minDate() {
    let TodaysDate = new Date().toISOString().split('T')[0];;
    document.getElementById('date').setAttribute('min', TodaysDate);
}

/**
 * safes the Json in an Array called "allTasks"
 * @param {Json} task - contains the safed Json
 */
function creatingJson(task) {
    allTasks.push(task);
    setItem('AllTasks', allTasks);
}

/**
 * empties all input-fields
 */
function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('assignedToSelect').value = '';;
    document.getElementById('date').value = '';
    document.getElementById('Category').value = '';
    document.getElementById('subtask').value = '';
    resetPrio();
}

function resetAssignedTo(){
    chosenContactsForNewTask = [];
    document.getElementById('ContainerForAllChosenContacts').innerHTML = ``;
}

/**
 * This function creates an overlay for confirmation that a task was created successfully
 */
function confirmTheCreationOfATask() {
    document.getElementById('Content').innerHTML += `
    <div id="confirmationContent" class="confirmationContent">
        <div class="fly-in">
            <h1 class="addTaskHeadline">The task was created successfully!</h1>
        </div>
        <button type="button" class="createTaskButton hover" onclick="addAnotherTask()">add another task</button>
        <br>
        <button type="button" class="createTaskButton hover" onclick="backToBoard()">go to board</button>
    </div>
    `;
}

/**
 * leads the user to board.html
 */
function backToBoard() {
    location.href = "board.html";
}

/**
 * leads the user to "add_task.html"
 */
function addAnotherTask() {
    location.href = "add_task.html";
}

/**
 * This function toggles the Images of the "Assigned to" Input
 * @param {String} id - ID of the Input-Field "Assigned to"
 */
function flipTheImage(id) {
    document.getElementById(`${id}`).classList.toggle('arrowdown');
    document.getElementById(`${id}`).classList.toggle('arrowup');
}

/**
 * this function sets the category
 * @param {string} category - sends the Category to this functions
 */
function setCategory(category) {
    let chosenCategory = document.getElementById('Category');
    chosenCategory.innerHTML = `${category}`;
    document.getElementById('categories').classList.toggle('d-none');
    document.getElementById('Category').setAttribute('style', 'color:black')
    document.getElementById('overlayCategories').classList.toggle('d-none');
}

/**
 * This function toggles a list of all possible categorys
 */
function getAllCategories() {
    document.getElementById('categories').classList.toggle('d-none');
    document.getElementById('overlayCategories').classList.toggle('d-none');
    if (window.innerWidth < 1400){
        document.getElementById("CategoryInputContainer").style.marginBottom = "90px";
    }
}

/**
 * This function opens / closes an Overlay for the Category-Section
 */
function closeOverlayCategories() {
    document.getElementById('overlayCategories').classList.toggle('d-none');
    document.getElementById('categories').classList.toggle('d-none');
    document.getElementById("CategoryInputContainer").style.marginBottom = "0px";
}