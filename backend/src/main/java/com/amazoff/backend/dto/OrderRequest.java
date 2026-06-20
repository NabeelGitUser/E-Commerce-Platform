// FILE: src/main/java/com/amazoff/backend/dto/OrderRequest.java
// ===========================================
package com.amazoff.backend.dto;

import lombok.Data;

@Data
public class OrderRequest {
    private Long productId;
    private Integer quantity;
    private String paymentMethod;
    private String paymentCode;
}