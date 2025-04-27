package com.bug_byte.web.model;

import jakarta.persistence.*;

import java.util.List;


@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false, length = 50)
    private String email;

    @Column(nullable = false)
    private int points;

    @ElementCollection
    @Column(nullable = false)
    private List<String> completedQuestionIds;

    @ElementCollection
    @Column
    private List<String> availableShopItems;

    @Column
    private String currentMonkeyId;

    @Column
    private String currentHat;

    public User(String username, String password, String email) {
        this.username = username;
        this.password = password;
        this.email = email;
        points = 0;
        completedQuestionIds = List.of();
        availableShopItems = List.of();
        currentMonkeyId = "monkey 1";
        currentHat = "";
    }

    public User() {}

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getEmail() {
        return email;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getPoints() { return points; }

    public void addPoints(int points) { this.points += points; }

    public void removePoints(int points) { this.points -= points; }

    public void addCompletedQuestionId(String id) { completedQuestionIds.add(id); }

    public void addShopItem(String item) { availableShopItems.add(item); }

    public void removeCompletedQuestionId(Long id) { completedQuestionIds.remove(id); }

    public void setCompletedQuestionIds(List<String> completedQuestionIds) { this.completedQuestionIds = completedQuestionIds; }

    public void setShopItems(List<String> availableShopItems) { this.availableShopItems = availableShopItems; }

    public List<String> getCompletedQuestionIds() { return completedQuestionIds; }

    public List<String> getShopItems() { return availableShopItems; }

    public void setCurrentMonkeyId(String currentMonkeyId) { this.currentMonkeyId = currentMonkeyId; }

    public void setCurrentHat(String currentHat) { this.currentHat = currentHat; }

    public String getCurrentMonkeyId() { return currentMonkeyId; }
    public String getCurrentHat() { return currentHat; }
}
