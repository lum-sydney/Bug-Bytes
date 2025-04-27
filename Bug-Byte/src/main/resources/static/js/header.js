
document.addEventListener("DOMContentLoaded", function () {
    fetch("/header1.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header-container").innerHTML = data;
            const loginBarBtn = document.getElementById("login-bar");
                const loginBarBtn2 = document.getElementById("login-bar2");
                const lessonsBtn = document.getElementById("lessons-dropdown");
                const shopBtn = document.getElementById("shop-bar");
                const profileBtn = document.getElementById("profile-icon");


                if (localStorage.getItem("isLoggedIn") === "true") {
                    loginBarBtn.style.display = "none";
                    profileBtn.style.display = "flex";
                    lessonsBtn.style.display = "flex";
                    shopBtn.style.display = "flex";
                    profileBtn.querySelector("img").src = monkeyLook();
                } else {
                    console.log("not logged in");
                    loginBarBtn.style.display = "flex";
                    profileBtn.style.display = "none";
                    lessonsBtn.style.display = "none";
                    shopBtn.style.display = "none";
                }
        })
        .catch(error => console.error("Error loading header:", error));

});
