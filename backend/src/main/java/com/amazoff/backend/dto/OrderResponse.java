// FILE: src/main/java/com/amazoff/backend/dto/OrderResponse.java
// ===========================================
package com.amazoff.backend.dto;

import com.amazoff.backend.entity.Order;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class OrderResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String productImage;
    private Integer quantity;
    private Double totalPrice;
    private String status;
    private String paymentMethod;
    private LocalDateTime orderDate;
    private String userEmail;
    private String userName;

    public OrderResponse(Order order) {
        this.id = order.getId();
        this.productId = order.getProduct().getId();
        this.productName = order.getProduct().getName();
        this.productImage = order.getProduct().getImageUrl();
        this.quantity = order.getQuantity();
        this.totalPrice = order.getTotalPrice();
        this.status = order.getStatus();
        this.paymentMethod = order.getPaymentMethod();
        this.orderDate = order.getOrderDate();
        this.userEmail = order.getUser().getEmail();
        this.userName = order.getUser().getFullName();
    }
}