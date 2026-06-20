// FILE: src/main/java/com/amazoff/backend/repository/ProductRepository.java
// ===========================================
package com.amazoff.backend.repository;

import com.amazoff.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByNameContainingIgnoreCase(String name);
    List<Product> findByCategory(String category);
}
