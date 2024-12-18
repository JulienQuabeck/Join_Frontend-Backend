let users = [];


/**
 * Starts the animation of the opening logo.
 */
async function initEntry() {
    await loadUsers();
    animateStartLogo();
    renderLogIn();
    setCurrentUsername('');
}


/**
 * Fetches list of users and it's according information from backend.
 */
async function loadUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch {
        console.info('Unable to load users');
    }
}


/**
 * Save's the new users data in the backend.
 * @param {string} password - Value of the password's input field.
 */
// async function signUp(password) {
//     let name = document.getElementById('name').value;
//     let email = document.getElementById('email').value;
//     debugger
//     users.push({
//         'name': name,
//         'email': email,
//         'password': password
//     })
//     await setItem('users', JSON.stringify(users));
//     toggleClass('sign-up-confirmation', 'fly-in');
//     toggleClass('confirmation-wrapper', 'dark-background');
//     setTimeout(function() {
//         renderLogIn();
//     }, 800);
// }
async function signUp(password) {
    let name = document.getElementById('name').value;
    let lastname = document.getElementById('lastname').value
    let email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;
    let color = generateRandomColor();
    users = {
        username: `${name}_${lastname}`,
        email: email,
        password: password,
        phone: phone,
        color: color,
    }
    const success = await addUserToServer(users);
    if (success) {
        toggleClass('sign-up-confirmation', 'fly-in');
        toggleClass('confirmation-wrapper', 'dark-background');
        setTimeout(function () {
            renderLogIn();
        }, 800);
    }
}

async function addUserToServer(users) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/register/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(users),
        });
        if (!response.ok) {
            const errorDetails = await response.json();
            console.error("Server Error Details:", errorDetails);
            throw new Error(`Failed to push contact: ${response.status}`);
        }
    } catch (error) {
        console.error("Failed to push task on the server:", error);
    }
}

function generateRandomColor() {
    let randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    return randomColor;
}


/**
 * Logs the user in.
 */
async function logIn(event) {
    event.preventDefault();
    let emailInput = document.getElementById('email').value;
    let passwordInput = document.getElementById('password').value;
    let data = {
        'email': emailInput,
        'password': passwordInput
    }
    await searchForUserInBackend(data);
    window.location.href = "summary.html";
}

async function searchForUserInBackend(data) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`Failed to logIn: ${response.status}`);
        }
        const responseData = await response.json();
        console.log(responseData);
        debugger
        
        saveDataInLocalStorage(responseData);
    } catch (error) {
        console.error("Failed to logIn", error);
    }
}

function saveDataInLocalStorage(responseData) {
    let dataAsText = JSON.stringify(responseData);
    localStorage.setItem('Data', dataAsText);
}

/**
 * Tries to find the data from the backend that matches his login data.
 * @param {} emailInput - Input field for email when loggin in.
 * @param {} passwordInput - Input field for password when loggin in.
 */
function findUser(emailInput, passwordInput) {
    let user = users.find(u => u.email === emailInput.value && u.password === passwordInput.value);
    if (user) {
        setCurrentUsername(user.name);
        window.location.href = 'summary.html';
    } else {
        toggleClass('error-message', 'hide');
    }
}


/**
 * Checks if the value of the password's input field and the value of the comfirm password's field are equal.
 */
async function validatePassword(event) {
    event.preventDefault();
    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirm-password').value;
    if (password === confirmPassword) {
        await signUp(password);
    } else {
        toggleClass('password-message', 'hide');
    }
}


/**
 * Animates the big Join logo at the start of the log in page.
 */
function animateStartLogo() {
    if (window.innerWidth > 700) {
        desktopStartAnimation();
    } else {
        mobileStartAnimation();
    }
}


/**
 * Begins the animation of the starting logo when index.html has loaded on desktop devices.
 */
function desktopStartAnimation() {
    setTimeout(function () {
        toggleClass('start-logo', 'animated-start-logo');
        toggleClass('form-wrapper', 'fade-in-content');
    }, 600);
}


/**
 * Begins the animation of the starting logo when index.html has loaded on mobile devices.
 */
function mobileStartAnimation() {
    let mobileStartBackground = document.getElementById('start-background-mobile');
    setTimeout(() => {
        toggleClass('start-logo-mobile', 'animated-start-logo');
        toggleClass('start-logo', 'animated-start-logo');
    }, 600);
    setTimeout(() => {
        mobileStartBackground.style.zIndex = -1;
    }, 1000);
}


/**
 * Renders the form for logging in.
 */
function renderLogIn() {
    let dynamicContent = document.getElementById('dynamic-content');
    dynamicContent.innerHTML = logInFormTemplate();
    checkIfEmpty('password', 'password-image');
}

/**
 * HTML template for better readability.
 * @returns HTML template of the log in form.
 */
function logInFormTemplate() {
    return /*html*/`
        <div class="sign-up-wrapper">
            <span>Not a Join user?</span>
            <button class="dark-button" onclick="renderSignUp()">Sign up</button>
        </div>
        <div id="form-wrapper">
            <div class="log-in-box">
                <h1>Log in</h1>
                <div class="headline-border" style="box-sizing: content-box !important;"></div>
                <form id="log-in-form" onsubmit="logIn(event); return false">
                    <div class="input-wrapper">
                        <input type="text" id="email" required placeholder="Email" autofocus>
                        <img id="email-image" src="/Frontend/assets/img/email-icon.png">
                    </div>
                    <div class="input-wrapper">
                        <input type="password" id="password" required placeholder="Password" oninput="checkIfEmpty('password', 'password-image')">
                        <img id="password-image" src="/Frontend/assets/img/password-icon.png" onclick="togglePasswordVisibility('password', 'password-image')">
                    </div>
                    <p id="error-message" class="hide">Ups! Your login details are incorrect.</p>
                    <div class="remember-me-box">
                        <input type="checkbox" id="remember-me">
                        <span>Remember me</span>
                    </div>
                    <div class="entry-buttons">
                        <button class="dark-button log-in-button-mobile" type="submit">Log in</button>
                        <button class="light-button" onclick="logInAsGuest()">Guest Log in</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}


/**
 * Checks if input field for password is empty.
 */
function checkIfEmpty(inputId, imageId) {
    let passwordInput = document.getElementById(inputId);
    let passwordImage = document.getElementById(imageId);
    if (passwordInput.value !== '') {
        changeImageSource(imageId, '/Frontend/assets/img/password-hidden.png');
        passwordImage.style.pointerEvents = 'all';
        passwordImage.style.cursor = 'pointer';
    } else {
        changeImageSource(imageId, '/Frontend/assets/img/password-icon.png');
        passwordImage.style.pointerEvents = 'none';
        passwordInput.type = 'password';
    }
}


/**
 * Toggles visibility of password in its input field.
 * @param {string} id - The input field's id.
 */
function togglePasswordVisibility(inputId, imageId) {
    let passwordInput = document.getElementById(inputId);
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        changeImageSource(imageId, '/assets/img/password-shown.png');
        passwordInput.focus();
    } else {
        passwordInput.type = 'password';
        changeImageSource(imageId, '/assets/img/password-hidden.png');
    }
}


/**
 * Sets up log in for guest user by disabling the form validation.
 */
function logInAsGuest() {
    let emailInputField = document.getElementById('email');
    emailInputField.removeAttribute('required');
    let passwordInputField = document.getElementById('password');
    passwordInputField.removeAttribute('required');
    let emailInput = "guest@guest.com";
    let passwordInput = "guestPassword";
    let id = 19;
    let token = "ee299600f43acc1d8e88f6b914a9a73ac2740aa7";
    let username = "Guest_Guest";
    responseData = {
        'username': username,
        'email': emailInput,
        'id': id,
        'token': token,
    }
    saveDataInLocalStorage(responseData)
    window.location.href = 'summary.html';
}

/**
 * Disables sign up button until the form is filled.
 */
function checkSignUpForm() {
    let nameInput = document.getElementById('name');
    let emailInput = document.getElementById('email');
    let passwordInput = document.getElementById('password');
    let confirmPasswordInput = document.getElementById('confirm-password');
    let privacyPolicyCheckBox = document.getElementById('privacy-policy-checkbox');
    let signUpButton = document.getElementById('sign-up-button');
    if (nameInput.value !== '' && emailInput.value !== '' && passwordInput.value !== '' && confirmPasswordInput.value !== '' && privacyPolicyCheckBox.checked === true) {
        signUpButton.disabled = false;
        signUpButton.classList.remove('disabled-button');
    } else {
        signUpButton.disabled = true;
        signUpButton.classList.add('disabled-button');
    }
}


/**
 * Renders the form for signing up.
 */
function renderSignUp() {
    let dynamicContent = document.getElementById('dynamic-content');
    dynamicContent.innerHTML = signUpFormTemplate();
    checkIfEmpty('password', 'password-image');
    checkIfEmpty('confirm-password', 'confirm-password-image');
}


/**
 * HTML template for better readability.
 * @returns HTML template of the sign up form.
 */
function signUpFormTemplate() {
    return/*html*/`
        <div id="form-wrapper">
            <div class="sign-up-box">
                <button class="arrow-left scale-on-hover" onclick="renderLogIn()"><img src="/Frontend/assets/img/arrow-left-line.png"></button>
                <h1>Sign up</h1>
                <div class="headline-border"></div>
                <form id="sign-up-form" onsubmit="validatePassword(event); return false;">
                    <div class="input-wrapper">
                        <input type="text" id="name" required placeholder="Name" oninput="checkSignUpForm()" autofocus>
                        <img id="email-image" src="/Frontend/assets/img/name-icon.png">
                    </div>
                    <div class="input-wrapper">
                        <input type="text" id="lastname" required placeholder="Lastname" oninput="checkSignUpForm()" autofocus>
                        <img id="email-image" src="/Frontend/assets/img/name-icon.png">
                    </div>
                    <div class="input-wrapper">
                    <input type="email" id="email" required placeholder="Email" oninput="checkSignUpForm()">
                        <img id="email-image" src="/Frontend/assets/img/email-icon.png">
                    </div>
                    <div class="input-wrapper">
                    <input type="tel" id="phone" required placeholder="phone" oninput="checkSignUpForm()">
                        <img id="email-image" src="/Frontend/assets/img/email-icon.png">
                    </div>
                    <div class="input-wrapper">
                        <input type="password" id="password" required placeholder="Password" minlength="8" autocomplete="new-password" oninput="checkIfEmpty('password', 'password-image'); checkSignUpForm();">
                        <img id="password-image" src="/Frontend/assets/img/password-icon.png" onclick="togglePasswordVisibility('password', 'password-image')">
                    </div>
                    <div class="input-wrapper">
                        <input type="password" id="confirm-password" required placeholder="Confirm password" oninput="checkIfEmpty('confirm-password', 'confirm-password-image'); checkSignUpForm();">
                        <img id="confirm-password-image" src="/Frontend/assets/img/password-icon.png" onclick="togglePasswordVisibility('confirm-password', 'confirm-password-image')">
                    </div>
                    <p id="password-message" class="hide">Ups! Your password doesn't match.</p>
                    <div class="privacy-policy-box">
                        <input type="checkbox" id="privacy-policy-checkbox" required onclick="checkSignUpForm()">
                        <span>I accept the</span>
                        <a class="scale-on-hover" href="privacy_policy.html">Privacy Policy</a>
                    </div>
                    <div class="entry-buttons">
                        <button id="sign-up-button" class="dark-button disabled-button" type="submit" disabled>Sign up</button>
                    </div>
                </form>
            </div>
        </div>
        <div id="confirmation-wrapper"></div>
        <p id="sign-up-confirmation" class="confirmation-message">
            You signed up successfully
        </p>
    `;
}