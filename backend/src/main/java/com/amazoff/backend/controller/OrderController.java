// FILE: src/main/java/com/amazoff/backend/controller/OrderController.java
// REPLACE ENTIRE FILE
// ===========================================
package com.amazoff.backend.controller;

import com.amazoff.backend.dto.MessageResponse;
import com.amazoff.backend.dto.OrderRequest;
import com.amazoff.backend.dto.OrderResponse;
import com.amazoff.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@RequestBody OrderRequest request) {
        return ResponseEntity.ok(orderService.createOrder(request));
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getUserOrders() {
        return ResponseEntity.ok(orderService.getUserOrders());
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<MessageResponse> cancelOrder(@PathVariable Long id) {
        orderService.cancelOrder(id);
        return ResponseEntity.ok(new MessageResponse("Order cancelled successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.ok(new MessageResponse("Order deleted successfully"));
    }
}