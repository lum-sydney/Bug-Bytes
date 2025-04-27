const email = document.getElementById("email");
const password = document.getElementById("password");
const username = document.getElementById("name");
let validEmail = false;
let validPassword = false;
let validUsername = false;

document.getElementById("sign-up-btn").addEventListener("click", function () {
    console.log(email.value, password.value, username.value);
    register(email.value, password.value, username.value);
})

email.addEventListener("blur", function () {

    if(!email.value.includes("@")) {
        if(email.value.length === 0) {
            document.getElementById("email-error").innerHTML = "Email is required";
            validEmail = false;
        } else {
            document.getElementById("email-error").innerHTML = "Invalid Email";
            validEmail = false;
        }
    } else {
        document.getElementById("email-error").innerHTML = "";
        validEmail = true;
    }

    if(!validEmail || !validPassword || !validUsername) {
        document.getElementById("sign-up-btn").disabled = true;
    } else {
        document.getElementById("sign-up-btn").disabled = false;
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

    if(!validEmail || !validPassword || !validUsername) {
        document.getElementById("sign-up-btn").disabled = true;
    } else {
        document.getElementById("sign-up-btn").disabled = false;
    }
})

username.addEventListener("blur", function () {
    if(username.value.length === 0) {
        document.getElementById("username-error").innerHTML = "Username is required";
        validUsername = false;
    } else if (username.value.includes("@")) {
        document.getElementById("username-error").innerHTML = "Username cannot contain @";
        validUsername = false;
    }
    else {
        document.getElementById("username-error").innerHTML = "";
        validUsername = true;
    }

    if(!validEmail || !validPassword || !validUsername) {
        document.getElementById("sign-up-btn").disabled = true;
    } else {
        document.getElementById("sign-up-btn").disabled = false;
    }
})

async function register(email, password, username) {
    let formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("username", username);

  try {
      const serverResponse = await fetch("/api/register", {
          method: "POST",
          body: formData
      })

      const resultData = await serverResponse.json();
      const registerResponse = resultData.register;

      if(registerResponse === "Account created") {
          const userData = resultData.user;

          if(userData !== undefined) delete userData.password;
          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("isLoggedIn", "true");
          window.location.href = "/";
      } else if (registerResponse === "Username and email already taken"){
          document.getElementById("username-error").innerHTML = "Username already exists";
          document.getElementById("email-error").innerHTML = "Email already exists";
      } else if(registerResponse === "Username already taken") {
          document.getElementById("username-error").innerHTML = "Username already exists";
      } else if (registerResponse === "Email already taken") {
          document.getElementById("email-error").innerHTML = "Email already exists";
      }
  } catch (error) {
      console.error("Error occurred:", error);
  }
}