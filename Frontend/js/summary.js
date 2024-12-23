let sumToDos = 0;
let sumDone = 0;
let sumInProgress = 0;
let sumAwaitFeedback = 0;

/**
 * Initializes certain functions once the body of the page has fully loaded.
 */
async function initSummary() {
    checkIfUserIsLoggedIn();
    let tasks = await loadTasksFromServer();
    countSumsForColums(tasks);
    checkLogInStatus();
    await init('summary');
    renderWelcomeMessage();
    renderTasksInToDo();
    renderTasksDone();
    sortTasks();
    renderUpcomingPrio(tasks);
    renderUpcomingDate(tasks);
    renderTasksInBoard();
    renderTasksInProgress();
    renderTasksAwaitingFeedback();
}

/**
 * This function loads all tasks from the server
 * @returns all tasks
 */
async function loadTasksFromServer(){
    const url = "http://127.0.0.1:8000/task/"
    let tasks = await fetch(url);
    const rawResponse = await tasks.text();
    return JSON.parse(rawResponse);
}

/**
 * This function calculates the sum of tasks in different colums of the board
 * @param {*} tasks 
 */
async function countSumsForColums(tasks){
    sumDone = 0;
    sumToDos = 0;
    for (i = 0; i < tasks.length; i++){
        if(tasks[i].colum == "todo"){
            sumToDos++;
        } else if (tasks[i].colum == "done"){
            sumDone++;
        } else if (tasks[i].colum == "in-progress"){
            sumInProgress++;
        } else if (tasks[i].colum == "await-feedback"){
            sumAwaitFeedback++;
        } 
    }
}

/**
 * Renders the welcome message on the summary page.
 */
function renderWelcomeMessage() {
    let username = getCurrentUsername();
    let time = new Date().getHours();
    if (window.innerWidth <= 1250) {
        renderMessageMobile(username, time);
    } else {
        renderMessageDesktop(username, time);
    }
}

/**
 * Renders the welcome message when on mobile device.
 * @param {string} username - Name of the current user.
 * @param {number} time - Current hour.
 */
function renderMessageMobile(username, time) {
    let mobileWelcomeMessage = document.getElementById('mobile-welcome');
    let welcomeMessage = document.getElementById('mobile-welcome-message');
    let usernameWrapper = document.getElementById('mobile-username-wrapper');
    chooseMessage(welcomeMessage, usernameWrapper, username, time);
    setTimeout(() => {
        mobileWelcomeMessage.style.zIndex = -1;
    }, 1500);
}

/**
 * Renders the welcome message when on desktop.
 * @param {string} username - Name of the current user.
 * @param {number} time - Current hour.
 */
function renderMessageDesktop(username, time) {
    let welcomeMessage = document.getElementById('welcome-message');
    let usernameWrapper = document.getElementById('username-wrapper');
    chooseMessage(welcomeMessage, usernameWrapper, username, time);
}

/**
 * Chooses how to greet, depending on the time.
 * @param {object} welcomeMessage The div which the welcome message is supposed to be shown in.
 * @param {object} usernameWrapper The div which the username is supposed to be shown in.
 * @param {string} username The name of the user.
 * @param {object} time Current time.
 */
function chooseMessage(welcomeMessage, usernameWrapper, username, time) {
    if (time < 10) {
        welcomeMessage.innerHTML = 'Good morning,';
        usernameWrapper.innerHTML = username;
    }
    if (time >= 10 && time < 14) {
        welcomeMessage.innerHTML = 'Good day,';
        usernameWrapper.innerHTML = username;
    }
    if (time >= 14 && time < 18) {
        welcomeMessage.innerHTML = 'Good afternoon,';
        usernameWrapper.innerHTML = username;
    }
    if (time >= 18) {
        welcomeMessage.innerHTML = 'Good evening,';
        usernameWrapper.innerHTML = username;
    }
}

/**
 * Renders the total amount of tasks on the board.
 */
function renderTasksInBoard() {
    let tasksInBoard = document.getElementById('tasks-amount');
    let tasksAmount = allTasks.length; //tasks --> allTasks
    tasksInBoard.innerHTML = tasksAmount;
}

/**
 * Sorts the tasks beginning with the latest task.
 */
function sortTasks() {
    allTasks.sort(function (a, b) { //tasks --> allTasks
        return new Date(a.date) - new Date(b.date);
    });
}

/**
 * Renders the upcoming task and its priority.
 */
function renderUpcomingPrio(tasks) {
    let upcomingPrio = document.getElementById('upcoming-prio');
    let prio = convertPrio(tasks[0]['priority']); //tasks --> allTasks
    let upcomingDate = tasks[0]['date']; //tasks --> allTasks
    let upcomingTasksAmount = tasks.filter(t => t['date'] == upcomingDate).length; //tasks --> allTasks
    let upcomingTasks = document.getElementById('upcoming-tasks-amount');
    upcomingPrio.innerHTML = prio;
    changeImageSource('upcoming-prio-image', `/Frontend/assets/img/board/prio-${prio}-white.svg`);
    toggleClass('upcoming-prio-image-wrapper', `prio-${prio}`);
    upcomingTasks.innerHTML = upcomingTasksAmount;
}

/**
 * Renders the due date of the upcoming task.
 */
function renderUpcomingDate(tasks) {
    let date = new Date(tasks[0]['date']); //tasks --> allTasks
    let formattedMonth = date.toLocaleString('default', { month: 'long' });
    let year = date.getFullYear();
    let day = date.getDate();
    let upcomingDate = document.getElementById('upcoming-date');
    let upcomingMessage = document.getElementById('upcoming-message');
    upcomingDate.innerHTML = day + ' ' + formattedMonth + ',' + ' ' + year;
    upcomingMessage.innerHTML = "Upcoming deadline";
}

/**
 * Renders the amount of tasks which are in progress.
 */
function renderTasksInProgress() {
    let tasksInProgress = document.getElementById('in-progress-amount');
    tasksInProgress.innerHTML = sumInProgress;
}

/**
 * Renders the amount of tasks which await feedback.
 */
function renderTasksAwaitingFeedback() {
    let tasksAwaitingFeedback = document.getElementById('awaiting-feedback-amount');
    tasksAwaitingFeedback.innerHTML = sumAwaitFeedback;
}

/**
 * Renders the amount of tasks which have to be done.
 */
function renderTasksInToDo() {
    let tasksToDo = document.getElementById('to-do-amount');
    tasksToDo.innerHTML = sumToDos;
}

/**
 * Renders the amount of tasks which are done.
 */
function renderTasksDone() {
    let tasksDone = document.getElementById('done-amount');
    tasksDone.innerHTML = sumDone;
}

/**
 * Converts the priority from a number to a string.
 * @param {number} number - Priority as a number. Number one represents ther priority "urgent" for example.
 * @returns Priority as string.
 */
function convertPrio(number) {
    if (number === 1) {
        return 'urgent'
    } else if (number === 2) {
        return 'medium'
    } else if (number === 3) {
        return 'low'
    }
}