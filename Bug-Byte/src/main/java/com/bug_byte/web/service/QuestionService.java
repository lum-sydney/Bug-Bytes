package com.bug_byte.web.service;

import com.bug_byte.web.model.Question;
import com.bug_byte.web.model.User;
import com.bug_byte.web.repo.QuestionRepo;
import com.bug_byte.web.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuestionService {

    private final QuestionRepo questionRepo;
    private final UserRepo userRepo;

    @Autowired
    public QuestionService(QuestionRepo questionRepo, UserRepo userRepo) {
        this.questionRepo = questionRepo;
        this.userRepo = userRepo;
    }

    public String checkAnswer(String questionId, String answer,Long userId, List<String> completedQuestionIds) {
        Optional<Question> optionalQuestion = questionRepo.findById(questionId);
        if (!optionalQuestion.isPresent()) {
            return "Invalid question id";
        }
        Question selectedQuestion = optionalQuestion.get();

        Optional<User> optionalUser = userRepo.findById(userId);
        if (!optionalUser.isPresent()) {
            return "Invalid user id";
        } else if (optionalUser.get().getCompletedQuestionIds().contains(questionId)) {
            return "Already answered";
        }

        List<String> savedQuestionIds = optionalUser.get().getCompletedQuestionIds();
        //if(!savedQuestionIds.equals(completedQuestionIds)) {
            //return "Question progression does not match";
        //}

        if (selectedQuestion.getAnswer().equals(answer)) {
            optionalUser.get().getCompletedQuestionIds().add(questionId);
            optionalUser.get().addPoints(selectedQuestion.getValue());
            userRepo.save(optionalUser.get());
            System.out.println(optionalUser.get().getCompletedQuestionIds());
            return "Correct";
        } else {
            return "Incorrect";
        }

    }

    public Optional<Question> getQuestionById(String questionId) {
        return questionRepo.findById(questionId);
    }
}
