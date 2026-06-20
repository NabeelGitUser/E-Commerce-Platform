// FILE: src/main/java/com/amazoff/backend/service/AuthService.java
// ===========================================
package com.amazoff.backend.service;

import com.amazoff.backend.dto.*;
import com.amazoff.backend.entity.User;
import com.amazoff.backend.repository.UserRepository;
import com.amazoff.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setRole("USER");

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return new AuthResponse(token, user.getEmail(), user.getFullName(), user.getRole());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return new AuthResponse(token, user.getEmail(), user.getFullName(), user.getRole());
    }

    public AuthResponse adminLogin(LoginRequest request) {
        // Admin credentials: admin@amazoff.com / admin123
        if (!"admin@amazoff.com".equals(request.getEmail()) ||
                !"admin123".equals(request.getPassword())) {
            throw new RuntimeException("Invalid admin credentials");
        }

        User admin = userRepository.findByEmail(request.getEmail())
                .orElseGet(() -> {
                    User newAdmin = new User();
                    newAdmin.setEmail("admin@amazoff.com");
                    newAdmin.setPassword(passwordEncoder.encode("admin123"));
                    newAdmin.setFullName("Admin");
                    newAdmin.setRole("ADMIN");
                    return userRepository.save(newAdmin);
                });

        String token = jwtUtil.generateToken(admin.getEmail(), admin.getRole());
        return new AuthResponse(token, admin.getEmail(), admin.getFullName(), admin.getRole());
    }
}