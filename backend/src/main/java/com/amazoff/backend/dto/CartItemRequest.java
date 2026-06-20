// FILE: src/main/java/com/amazoff/backend/dto/CartItemRequest.java
// ===========================================
package com.amazoff.backend.dto;

import lombok.Data;

@Data
public class CartItemRequest {
    private Long productId;
    private Integer quantity;
}
