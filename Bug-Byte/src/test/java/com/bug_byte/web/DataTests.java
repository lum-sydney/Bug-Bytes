package com.bug_byte.web;


import com.bug_byte.web.model.User;
import com.bug_byte.web.repo.UserRepo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class DataTests {
    @Autowired
    private UserRepo userRepo;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    public void testCreateUser() {
        User user = new User();
        user.setUsername("totallyrealuser");
        user.setPassword("P4ssw0rd");
        userRepo.save(user);

        User existedUser = entityManager.find(User.class, user.getId());

        assert existedUser.getUsername().equals(user.getUsername());
    }
}
