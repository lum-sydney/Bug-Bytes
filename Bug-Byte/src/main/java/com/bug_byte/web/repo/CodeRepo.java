package com.bug_byte.web.repo;

import com.bug_byte.web.model.CodeReq;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CodeRepo extends JpaRepository<CodeReq, String> {
}
