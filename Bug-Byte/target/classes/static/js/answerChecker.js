export async function checkAnswer(questionId) {
    const questionGroup = document.getElementById(questionId);
    if (!questionGroup) {
        console.error(`No question group found with id: ${questionId}`);
        return;
    }

    const response = questionGroup.querySelector("[name='result']");
    response.style.display = "block";
    const selectedAnswer = questionGroup.querySelector("input[name='answer']:checked");

    if (!selectedAnswer) {
        response.innerHTML = "Please select an answer.";
        return;
    }

    let formData = new FormData();

    formData.append("questionId", questionId);
    formData.append("selectedAnswer", selectedAnswer.value);
    formData.append("userId", 6);

    try {
        const serverResponse = await fetch(`/api/answerCheck`, {
            method: "POST",
            body: formData
        });

        const result = await serverResponse.text();

        if (result === "Correct") {
            response.innerHTML = "Correct!";
            response.style.color = "green";
            questionGroup.querySelectorAll('input[name="answer"]').forEach(radio => {
                radio.disabled = true;
            });
        } else if (result === "Incorrect") {
            response.innerHTML = "Incorrect!";
            response.style.color = "red";
            selectedAnswer.disabled = true;
        } else {
            response.innerHTML = "Error occurred. Please try again later.";
        }
    } catch (error) {
        console.error("Error occurred:", error);
        response.innerHTML = "Error submitting your answer. Please try again later.";
        response.style.color = "red";
    }
}