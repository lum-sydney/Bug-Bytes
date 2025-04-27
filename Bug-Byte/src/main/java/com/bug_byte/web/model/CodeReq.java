package com.bug_byte.web.model;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import java.util.List;

@Entity
public class CodeReq {
    @Id
    private String id;

    @Column(nullable = false)
    private String question;

    @ElementCollection
    @Column(nullable = false)
    private List<String> requirements;

    @Column(nullable=false)
    private String output;

    public CodeReq(String id, String question, List<String> requirements, String output) {
        this.question = question;
        this.requirements = requirements;
        this.id = id;
        this.output = output;
    }

    public CodeReq() {

    }

    public String getOutput() {
        return output;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public List<String> getRequirements() {
        return requirements;
    }

    public void setRequirements(List<String> requirements) {
        this.requirements = requirements;
    }
}
