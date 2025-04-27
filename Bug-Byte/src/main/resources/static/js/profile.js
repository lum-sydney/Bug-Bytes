import {monkeyLook} from "./common.js";

document.addEventListener("DOMContentLoaded", () => {
    const profileName = document.getElementById("user-name-text");
    const email = document.getElementById("profile-email-text");
    const points = document.getElementById("profile-points-text");
    const questionCompleted = document.getElementById("profile-question-completed");

    const user = JSON.parse(localStorage.getItem("user"));
    if (user === null)
        window.location.href = "/";
    profileName.innerText = user.username + "'s Profile";
    console.log(monkeyLook());
    document.getElementById("profile-pic").src = monkeyLook();


    email.innerHTML = `<strong>Email:</strong> ${user.email}`;
    points.innerHTML = `<strong>Points:</strong> ${user.points}`;
    questionCompleted.innerHTML = `<strong>Questions Completed:</strong> ${user.completedQuestionIds.length}`;
});

document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "/";
});
