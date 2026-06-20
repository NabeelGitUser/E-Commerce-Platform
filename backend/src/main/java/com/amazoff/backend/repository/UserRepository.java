// FILE: src/main/java/com/amazoff/backend/repository/UserRepository.java
// ===========================================
package com.amazoff.backend.repository;

import com.amazoff.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
