// FILE: src/main/java/com/amazoff/backend/dto/SignupRequest.java
// ===========================================
package com.amazoff.backend.dto;

import lombok.Data;

@Data
public class SignupRequest {
    private String email;
    private String password;
    private String fullName;
}