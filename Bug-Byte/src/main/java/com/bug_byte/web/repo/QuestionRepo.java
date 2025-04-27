package com.bug_byte.web.repo;

import com.bug_byte.web.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepo extends JpaRepository<Question, String> {
}
