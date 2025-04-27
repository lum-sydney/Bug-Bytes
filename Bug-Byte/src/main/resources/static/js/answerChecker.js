export async function checkAnswer(questionId) {
    const questionGroup = document.getElementById(questionId);
    const user = JSON.parse(localStorage.getItem("user"));

    const response = questionGroup.querySelector(".result-txt");
    response.style.display = "block";

    let selectedAnswer = questionGroup.querySelector("input[name='answer']:checked")
        || questionGroup.querySelector("select[name='answer']");

    if (!selectedAnswer || selectedAnswer.value === "") {
        response.innerHTML = "Please select an answer.";
        response.style.color = "orange";
        return;
    }

    let formData = new FormData();

    formData.append("selectedAnswer", selectedAnswer.value);
    formData.append("questionId", questionId);
    formData.append("userId", user.id);
    formData.append("userQuestions", user.completedQuestionIds);

    try {
        const serverResponse = await fetch(`/api/answerCheck`, {
            method: "POST",
            body: formData
        });

        const result = await serverResponse.json();
        const answer = result.Answer;
        const compQuestions = result.userQuestions;

        if (answer === "Correct") {
            selectedAnswer.disabled = true;

            let userOld = JSON.parse(localStorage.getItem("user"));
            userOld.completedQuestionIds = compQuestions;
            userOld.points += 10;
            localStorage.setItem("user", JSON.stringify(userOld));
            response.innerHTML = "";

            questionGroup.querySelector(".submit-btn").disabled = true;

            if(questionId.includes("multi")) {
                selectedAnswer.parentElement.classList.add("correct");
                selectedAnswer.checked = true;
                questionGroup.querySelector("p").innerHTML = questionGroup.querySelector("p").innerHTML + "✅";
            } else if (questionId.includes("select")) {
                selectedAnswer.selected = true;
                selectedAnswer.parentElement.disabled = true;
                if (!questionGroup.querySelector(".checkmark")) {
                    const checkmark = document.createElement("span");
                    checkmark.textContent = "✅";
                    checkmark.classList.add("checkmark");
                    questionGroup.querySelector("p").appendChild(checkmark);
                }
            }
        } else if (answer === "Incorrect") {
            response.innerHTML = "Incorrect!";
            response.style.color = "red";

            if(selectedAnswer.tagName === "INPUT"){
                selectedAnswer.disabled = true;
            }
        } else {
            response.innerHTML = "Error occurred. Please try again later.";
        }
    } catch (error) {
        console.error("Error occurred:", error);
        response.innerHTML = "Error submitting your answer. Please try again later.";
        response.style.color = "red";
    }
}