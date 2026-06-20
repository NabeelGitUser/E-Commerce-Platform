// FILE: src/main/java/com/amazoff/backend/repository/OrderRepository.java
// ===========================================
package com.amazoff.backend.repository;

import com.amazoff.backend.entity.Order;
import com.amazoff.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
    List<Order> findByUserOrderByOrderDateDesc(User user);
    List<Order> findAllByOrderByOrderDateDesc();
}