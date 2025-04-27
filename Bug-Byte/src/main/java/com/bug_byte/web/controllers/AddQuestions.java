package com.bug_byte.web.controllers;

import com.bug_byte.web.model.CodeReq;
import com.bug_byte.web.model.Question;
import com.bug_byte.web.model.ShopItem;
import com.bug_byte.web.repo.CodeRepo;
import com.bug_byte.web.repo.ItemRepo;
import com.bug_byte.web.repo.QuestionRepo;
import com.bug_byte.web.repo.UserRepo;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class AddQuestions {

    QuestionRepo questionRepo;
    CodeRepo codeRepo;
    UserRepo userRepo;
    ItemRepo itemRepo;

    public AddQuestions(QuestionRepo questionRepo, CodeRepo codeRepo, UserRepo userRepo, ItemRepo itemRepo) {
        this.questionRepo = questionRepo;
        this.codeRepo = codeRepo;
        this.userRepo = userRepo;
        this.itemRepo = itemRepo;
    }

    public void populationQuestionDB() {
        codeRepo.deleteAll();
        questionRepo.deleteAll();
        itemRepo.deleteAll();

        //Add or remove any questions here and rerun the app (Make sure the id is the same id as the question HTML group)
        //Also make sure no ids repeat between questions (even from code req to question list)

        List<CodeReq> codeReqList = new ArrayList<>(Arrays.asList(
                new CodeReq("code-1", "Write the Code Variable Practice", Arrays.asList("int x = 7", "System.out.println"), "The value of x is 7")
        ));

        List<Question> questionList = new ArrayList<>(Arrays.asList(
                new Question("multi-1", "Which of the following statements about the Java program below is TRUE?", "4", 10),
                new Question("select-1", "Java is a __ programming language.", "3", 10),
                new Question("multi-2", "Which of the following correctly declares a variable to store a single character, such as the letter 'A'?", "2", 10)
        ));

        List<ShopItem> shopItems = new ArrayList<>(Arrays.asList(
                new ShopItem("hat 1", "Hat","Top Hat", 10, "hat_1.png"),
                new ShopItem("hat 2", "Hat","Wizard Hat", 10, "hat_2.png"),
                new ShopItem("hat 3", "Hat","Cowboy Hat", 10, "hat_3.png"),
                new ShopItem("monkey 1", "Monkey", "Monkey 1", 10, "monkey_1.png")
        ));


        questionRepo.saveAll(questionList);

        codeRepo.saveAll(codeReqList);

        itemRepo.saveAll(shopItems);

        questionList.clear();
    }
}
