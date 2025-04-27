package com.bug_byte.web.repo;

import com.bug_byte.web.model.ShopItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepo extends JpaRepository<ShopItem, String> {
}
