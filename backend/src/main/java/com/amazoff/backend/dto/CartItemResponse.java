// FILE: src/main/java/com/amazoff/backend/dto/CartItemResponse.java
// ===========================================
package com.amazoff.backend.dto;

import com.amazoff.backend.entity.CartItem;
import lombok.Data;

@Data
public class CartItemResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String productImage;
    private Double price;
    private Integer quantity;
    private Double total;

    public CartItemResponse(CartItem cartItem) {
        this.id = cartItem.getId();
        this.productId = cartItem.getProduct().getId();
        this.productName = cartItem.getProduct().getName();
        this.productImage = cartItem.getProduct().getImageUrl();
        this.price = cartItem.getProduct().getPrice();
        this.quantity = cartItem.getQuantity();
        this.total = this.price * this.quantity;
    }
}