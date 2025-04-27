export async function uploadAnswer(questionId) {
    const questionGroup = document.getElementById(questionId);
    const fileUpload = questionGroup.querySelector("[name='fileUpload']");
    const response = questionGroup.querySelector("[name='result']");
    let formData = new FormData();
    if (!fileUpload.files[0]) {
        response.innerHTML = "Please select a file to upload.";
        return;
    }
    formData.append("fileUploaded", fileUpload.files[0]);
    formData.append("questionId", questionId);

 try {
     const serverResponse = await fetch("/api/answerUpload", {
         method: "POST",
         body: formData
     })

     const result = await serverResponse.text();
     console.log(result);
     if(result === "Correct") {
         response.innerHTML = "Correct!";
         response.style.color = "green";
     } else if (result === "Compilation Error") {
         response.innerHTML = "Complication Error: Try to Run the Code in your IDE";
         response.style.color = "red";
     } else{
         response.innerHTML = "Missing Required Lines: " + result;
         response.style.color = "red";
     }
 } catch (error) {
     console.error("Error occurred:", error);
     response.innerHTML = "Error submitting your answer. Please try again later.";
     response.style.color = "red";
 }
}