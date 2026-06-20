// FILE: src/main/java/com/amazoff/backend/repository/CartItemRepository.java
// ===========================================
package com.amazoff.backend.repository;

import com.amazoff.backend.entity.CartItem;
import com.amazoff.backend.entity.User;
import com.amazoff.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    Optional<CartItem> findByUserAndProduct(User user, Product product);
    void deleteByUser(User user);
}