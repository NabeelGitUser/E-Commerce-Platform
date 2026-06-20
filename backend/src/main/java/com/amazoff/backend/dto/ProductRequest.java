// FILE: src/main/java/com/amazoff/backend/dto/ProductRequest.java
// ===========================================
package com.amazoff.backend.dto;

import lombok.Data;

@Data
public class ProductRequest {
    private String name;
    private String description;
    private Double price;
    private String imageUrl;
    private Integer stock;
    private String category;
}