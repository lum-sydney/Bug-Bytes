const userValues = document.querySelectorAll(".user-name");
const user = JSON.parse(localStorage.getItem("user"));
userValues.forEach(value => {
    value.innerText = user.username;
})

document.addEventListener("DOMContentLoaded", () => {
    const loginBarBtn = document.getElementById("login-bar");
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
});



export function monkeyLook() {
    const user = JSON.parse(localStorage.getItem("user"));
    const hat = user.currentHat.replace(/\D/g, '');
    const monkey = user.currentMonkeyId.replace(/\D/g, '');
    console.log(`/images/monkey${monkey}_${hat}.png`);
    return `/images/monkey${monkey}_${hat}.png`;
}

export function monkeyLookTemp(monkeyId, hatId) {
    console.log(monkeyId, hatId);
    const hat = hatId.replace(/\D/g, '');
    const monkey = monkeyId.replace(/\D/g, '');
    return `/images/monkey${monkey}_${hat}.png`;
}
