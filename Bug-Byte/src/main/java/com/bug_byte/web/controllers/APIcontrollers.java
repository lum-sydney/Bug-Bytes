package com.bug_byte.web.controllers;

import com.bug_byte.web.model.CodeReq;
import com.bug_byte.web.model.Question;
import com.bug_byte.web.model.User;
import com.bug_byte.web.repo.CodeRepo;
import com.bug_byte.web.service.QuestionService;
import com.bug_byte.web.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class APIcontrollers {
    @Autowired
    private QuestionService questionService;
    @Autowired
    private CodeRepo codeRepo;
    @Autowired
    private UserService userService;

    @PostMapping("/answerCheck")
    public ResponseEntity<Map<String, Object>> answerChecker(
            @RequestParam("selectedAnswer") String selectedAnswer,
            @RequestParam("questionId") String questionId,
            @RequestParam("userId") Long userId,
            @RequestParam("userQuestions") List<String> userQuestions) {
        Map<String, Object> response = new HashMap<>();
        String responseString = questionService.checkAnswer(questionId, selectedAnswer, userId, userQuestions);
        response.put("Answer", responseString);
        if(responseString.equals("Correct")) {
            userQuestions.add(questionId);
            response.put("userQuestions", userQuestions);
            return ResponseEntity.ok(response);
        } else {
            response.put("userQuestions", userQuestions);
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping("/answerUploading")
    public ResponseEntity<Map<String, Object>> getUpload(@RequestParam("questionId") String questionId,
                                                        @RequestParam("fileUploaded") MultipartFile fileUploaded,
                                                        @RequestParam("userName") String userName) throws IOException {
        File tempFile = new File(System.getProperty("java.io.tmpdir") + "/" + fileUploaded.getOriginalFilename());
        CodeReq codeReq = codeRepo.getReferenceById(questionId);
        User user = userService.getUserByUsername(userName);
        CodeCheck checker = new CodeCheck();
        Map<String, Object> response = new HashMap<>();
        fileUploaded.transferTo(tempFile);

        if (!tempFile.getName().contains(".java")) {
            response.put("codeResponse", "Wrong file type");
            response.put("user", user);
            return ResponseEntity.ok(response);
        }

        String codeReqResponse = checker.compileJavaFile(tempFile, codeReq);

        if(codeReqResponse.equals("Correct")) {
            user.addCompletedQuestionId(questionId);
            user.addPoints(20);
        }

        response.put("user", user);
        response.put("codeResponse", codeReqResponse);


        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerUser(
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestParam("email") String email) {
        Map<String, Object> response = new HashMap<>();
        User user = new User();

        if(username.isBlank() || password.isBlank()  || email.isBlank())
            return ResponseEntity.ok(response);

        String responseString = userService.register(username, password, email);
        if(responseString.equals("Account created")) {
            user = userService.getUserByUsername(username);
        }

        response.put("register", responseString);
        response.put("user", user);
        System.out.println();
        System.out.println(user.getCompletedQuestionIds());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(
            @RequestParam("inputValue") String inputValue,
            @RequestParam("password") String password) {
        System.out.println("Trying to login: " + inputValue + " " + password);
        Map<String, Object> response = new HashMap<>();
        String responseString = userService.login(inputValue, password);

        response.put("login", responseString);
        User user = new User();
        if(responseString.equals("Login successful")) {
            if(inputValue.contains("@")) {
                user = userService.getUserByEmail(inputValue);
            } else {
                user = userService.getUserByUsername(inputValue);
            }
            System.out.println(user.getCurrentHat());
            System.out.println(user.getCurrentMonkeyId());
            response.put("user", user);
            return ResponseEntity.ok(response);
        } else {
            user = null;
            response.put("user", user);
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping("/buyItem")
    public ResponseEntity<Map<String, Object>> buyItem(
            @RequestParam String itemId,
            @RequestParam Long userId,
            @RequestParam List<String> sendCurItems) {
        Map<String, Object> response = new HashMap<>();
        String responseString = userService.purchaseItem(userId, itemId, sendCurItems);
        if(responseString.equals("Purchase successful")) {
            sendCurItems.add(itemId);
            response.put("purchase", responseString);
            response.put("items", sendCurItems);
            return ResponseEntity.ok(response);
        } else {
            response.put("purchase", responseString);
            response.put("items", sendCurItems);
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping("/changeLook")
    public ResponseEntity<Map<String, Object>> changeLook(
            @RequestParam String itemId,
            @RequestParam String part,
            @RequestParam Long userId,
            @RequestParam List<String> sendCurItems){
        Map<String, Object> response = new HashMap<>();
        String responseString = userService.changeLook(userId, itemId, part, sendCurItems);

        response.put("change", responseString);
        response.put("items", sendCurItems);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/GetRightAns")
    public String getRightAns(@RequestParam String questionId) {
        Optional<Question> question = questionService.getQuestionById(questionId);
        if(question.isPresent()) {
            return question.get().getAnswer();
        }
        return null;
    }



}
