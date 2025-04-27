const userName = document.getElementById("name");
const password = document.getElementById("password");
let validUser = false;
let validPassword = false;


document.getElementById("login-btn").addEventListener("click", function () {
    console.log(userName.value, password.value);
    login(userName.value, password.value);
})

userName.addEventListener("blur", function () {
    if(userName.value.length === 0) {
        document.getElementById("username-error").innerHTML = "User/Email is required";
        validUser = false;
    } else {
        document.getElementById("username-error").innerHTML = "";
        validUser = true;
    }

    if(!validUser || !validPassword) {
        document.getElementById("login-btn").disabled = true;
    } else {
        document.getElementById("login-btn").disabled = false;
    }
})

password.addEventListener("blur", function () {
    if(password.value.length === 0) {
        document.getElementById("password-error").innerHTML = "Password is required";
        validPassword = false;
    } else {
        document.getElementById("password-error").innerHTML = "";
        validPassword = true;
    }

    if(!validUser || !validPassword) {
        document.getElementById("login-btn").disabled = true;
    } else {
        document.getElementById("login-btn").disabled = false;
    }
})


async function login(userValue, passValue) {
    let formData = new FormData();
    formData.append("inputValue", userValue);
    formData.append("password", passValue);

    const serverResponse = await fetch("/api/login", {
        method: "POST",
        body:formData
    })

    const resultData = await serverResponse.json();
    const loginResponse = resultData.login;



    if(loginResponse === "Login successful") {
        const userData = resultData.user;
        console.log(userData);
        if(userData !== undefined) delete userData.password;
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("isLoggedIn", "true");
        console.log(userData);
        document.getElementById("username-error").innerHTML = "";
        document.getElementById("password-error").innerHTML = "";
        window.location.href = "/";
    } else if (loginResponse === "Invalid email" || loginResponse === "Invalid username") {
        document.getElementById("password-error").innerHTML = "";
        document.getElementById("username-error").innerHTML = "User does not exist.";
    } else if (loginResponse === "Invalid password") {
        document.getElementById("username-error").innerHTML = "";
        document.getElementById("password-error").innerHTML = "Incorrect Password.";
    }
}