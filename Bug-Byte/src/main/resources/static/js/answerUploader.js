export async function uploadAnswer(questionId) {
    const questionGroup = document.getElementById(questionId);
    const fileUpload = questionGroup.querySelector("[class='fileUpload']");
    const response = questionGroup.querySelector("[class='result-txt']");
    const curUser = JSON.parse(localStorage.getItem("user"));

    if (!curUser) {
        response.innerHTML = "Please log in to submit your answer.";
        response.style.color = "red";
        return;
    }

    let formData = new FormData();
    if (!fileUpload.files[0]) {
        response.innerHTML = "Please select a file.";
        response.style.color = "orange";
        return;
    }
    formData.append("fileUploaded", fileUpload.files[0]);
    formData.append("questionId", questionId);
    formData.append("userName", curUser.username);

    try {
        const serverResponse = await fetch("/api/answerUploading", {
            method: "POST",
            body: formData,
            credentials: 'include'
        });

        const result = await serverResponse.json();
        const ansResponse = result.codeResponse;
        const sentUser = result.user;
        if(sentUser !== undefined) delete sentUser.password;
        console.log(ansResponse);
        console.log(sentUser);

        if(ansResponse === "Correct") {
            questionGroup.querySelector("p").innerHTML = questionGroup.querySelector("p").innerHTML + "✅";
            questionGroup.querySelector(".submit-btn").disabled = true;
            questionGroup.querySelector(".fileUpload").disabled = true;
            questionGroup.querySelector(".upload-btn").classList.add("disabled");
            response.innerHTML = "Correct!";
            response.style.color = "green";
            localStorage.setItem("user", JSON.stringify(sentUser));
        } else if (ansResponse === "Incorrect output") {
            response.innerHTML = "Incorrect output: Double check the output in your IDE.";
            response.style.color = "red";
        } else if (ansResponse === "Compilation Error") {
            response.innerHTML = "Compilation Error: Double check your code. Run it in your IDE for more information.";
            response.style.color = "red";
        } else {
            response.innerHTML = "The following line requirements are not met:" + ansResponse;
        }

    } catch (error) {
        console.error("Error occurred:", error);
        response.innerHTML = "Error submitting your answer. Please try again later.";
        response.style.color = "red";
    }
}