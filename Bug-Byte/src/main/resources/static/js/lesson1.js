import { checkAnswer } from "./answerChecker.js";
import { uploadAnswer } from "./answerUploader.js";

const completedQuestions = JSON.parse(localStorage.getItem("user")).completedQuestionIds;

document.querySelectorAll(".submit-btn").forEach(button => {
    button.addEventListener("click", function () {
        const questionGroup = button.closest(".lesson-question");
        const questionGroupId = questionGroup.id;

        if(questionGroup.classList.contains("code-upload-question")) {
            uploadAnswer(questionGroupId);
        } else {
            checkAnswer(questionGroupId);
        }

    });
});

document.querySelectorAll(".fileUpload").forEach(input => {
    input.addEventListener('change', function(event) {
        const fileNameDisplay = event.target.closest(".lesson-question")
            .querySelector('.result-txt');

        const selectedFile = event.target.files[0];

        if (selectedFile) {
            fileNameDisplay.textContent = `Selected file: ${selectedFile.name}`;
            fileNameDisplay.style.display = "block";
            fileNameDisplay.style.color = "black";
        } else {
            fileNameDisplay.textContent = "No file selected.";
            fileNameDisplay.style.display = "block";
            fileNameDisplay.style.color = "red";
        }
    });
});


for (let i = 0; i < completedQuestions.length; i++) {
    const questionGroup = document.getElementById(completedQuestions[i]);
    questionGroup.querySelectorAll('input[name="answer"]').forEach(radio => {
        radio.disabled = true;
    });
    questionGroup.querySelector("[class='submit-btn']").disabled = true;
    try {
        let formData = new FormData();
        formData.append("questionId", completedQuestions[i]);
        const serverResponse = await fetch(`/api/GetRightAns`, {
            method: "POST",
            body: formData
        });
        const result = await serverResponse.text();
        if(completedQuestions[i].includes("multi")) {
            const correctOption = questionGroup.querySelector(`input[value="${result}"]`);
            correctOption.parentElement.classList.add("correct");
            correctOption.checked = true;
            questionGroup.querySelector("p").innerHTML = questionGroup.querySelector("p").innerHTML + "✅";
        } else if (completedQuestions[i].includes("select")) {
            const correctOption = questionGroup.querySelector(`option[value="${result}"]`);
            correctOption.selected = true;
            correctOption.parentElement.disabled = true;

            if (!questionGroup.querySelector(".checkmark")) {

                const checkmark = document.createElement("span");
                checkmark.textContent = " ✅";
                checkmark.classList.add("checkmark");
                questionGroup.querySelector("p").appendChild(checkmark);
            }
        } else if (completedQuestions[i].includes("code")) {
            questionGroup.querySelector("p").innerHTML = questionGroup.querySelector("p").innerHTML + "✅";
            questionGroup.querySelector(".submit-btn").disabled = true;
            questionGroup.querySelector(".fileUpload").disabled = true;
            questionGroup.querySelector(".upload-btn").classList.add("disabled");
        }


    } catch(error) {
        console.log("Error: " + error);
    }
}