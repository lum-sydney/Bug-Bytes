package com.bug_byte.web.service;

import com.bug_byte.web.model.User;
import com.bug_byte.web.repo.UserRepo;
import com.bug_byte.web.model.ShopItem;
import com.bug_byte.web.repo.ItemRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.locks.Condition;

@Service
public class UserService {
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final ItemRepo itemRepo;

    @Autowired
    public UserService(UserRepo userRepo, PasswordEncoder passwordEncoder, ItemRepo itemRepo) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.itemRepo = itemRepo;
    }


    public String register(String username, String password, String email) {
        if(userRepo.findByUsername(username) != null) {
            if(userRepo.findByEmail(email) != null) {
                return "Username and email already taken";
            } else return "Username already taken";
        } else if (userRepo.findByEmail(email) != null) {
            return "Email already taken";
        }
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setCompletedQuestionIds(List.of());
        user.setShopItems(List.of("monkey 1"));
        user.setCurrentMonkeyId("monkey 1");
        user.setCurrentHat("");
        userRepo.save(user);
        return "Account created";
    }

    public String login(String loginUser, String password) {
        if(loginUser.contains("@")) {
            User user = userRepo.findByEmail(loginUser);
            if(user == null) {
                return "Invalid email";
            } else if (!passwordEncoder.matches(password, user.getPassword())) {
                return "Invalid password";
            } else return "Login successful";
        } else {
            User user = userRepo.findByUsername(loginUser);
            if(user == null) {
                return "Invalid username";
            } else if (!passwordEncoder.matches(password, user.getPassword())) {
                return "Invalid password";
            } else return "Login successful";
        }

    }

    public String purchaseItem(Long userId, String itemId, List<String> sendCurItems) {
        System.out.println(sendCurItems);
        System.out.println(userId);
        System.out.println(itemId);
        Optional<User> optionalUser = userRepo.findById(userId);
        if (optionalUser.isEmpty()) {
            return "Invalid user id";
        }

        Optional<ShopItem> optionalItem = itemRepo.findById(itemId);
        if (optionalItem.isEmpty()) {
            return "Invalid item id";
        }

        User user = optionalUser.get();
        ShopItem item = optionalItem.get();

        if (user.getPoints() < item.getPrice()) {
            return "Not enough points";
        } else if (user.getShopItems().contains(itemId)) {
            return "Item already owned";
        }

        List<String> curSavedList = new ArrayList<>(user.getShopItems());
        List<String> sortedSendCurItems = new ArrayList<>(sendCurItems);
        curSavedList.sort(String::compareToIgnoreCase);
        sortedSendCurItems.sort(String::compareToIgnoreCase);
        System.out.println(curSavedList);
        System.out.println(sortedSendCurItems);
        if (!curSavedList.equals(sortedSendCurItems)) {
            return "Shop progression does not match";
        }

        user.removePoints(item.getPrice());
        user.addShopItem(itemId);
        userRepo.save(user);
        return "Purchase successful";
    }

    public String changeLook(Long userId, String itemId, String part, List<String> sendCurItems){
        Optional<User> optionalUser = userRepo.findById(userId);
        if (optionalUser.isEmpty()) {
            return "Invalid user id";
        }
        User user = optionalUser.get();
        if(!user.getShopItems().contains(itemId)) {
            return "Item not owned";
        }
        List<String> curSavedList = new ArrayList<>(user.getShopItems());
        List<String> sortedSendCurItems = new ArrayList<>(sendCurItems);
        curSavedList.sort(String::compareToIgnoreCase);
        sortedSendCurItems.sort(String::compareToIgnoreCase);
        System.out.println(curSavedList);
        System.out.println(sortedSendCurItems);
        if (!curSavedList.equals(sortedSendCurItems)) {
            return "Shop progression does not match";
        }

        if(part.equals("monkey")) {
            user.setCurrentMonkeyId(itemId);
            userRepo.save(user);
            return "Success";
        } else if(part.equals("hat")) {
            user.setCurrentHat(itemId);
            userRepo.save(user);
            return "Success";
        } else {
            return "Invalid part";
        }
    }

    public User getUserByUsername(String username) {
        return userRepo.findByUsername(username);
    }

    public User getUserByEmail(String email) {
        return userRepo.findByEmail(email);
    }
}
