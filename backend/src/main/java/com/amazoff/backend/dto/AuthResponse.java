// FILE: src/main/java/com/amazoff/backend/dto/AuthResponse.java
// ===========================================
package com.amazoff.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String email;
    private String fullName;
    private String role;
}
