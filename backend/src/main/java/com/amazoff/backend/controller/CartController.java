// FILE: src/main/java/com/amazoff/backend/controller/CartController.java
// ===========================================
package com.amazoff.backend.controller;

import com.amazoff.backend.dto.CartItemRequest;
import com.amazoff.backend.dto.CartItemResponse;
import com.amazoff.backend.dto.MessageResponse;
import com.amazoff.backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping
    public ResponseEntity<CartItemResponse> addToCart(@RequestBody CartItemRequest request) {
        return ResponseEntity.ok(cartService.addToCart(request));
    }

    @GetMapping
    public ResponseEntity<List<CartItemResponse>> getCartItems() {
        return ResponseEntity.ok(cartService.getCartItems());
    }

    @PutMapping("/{id}")
    public ResponseEntity<CartItemResponse> updateCartItem(@PathVariable Long id,
                                                           @RequestParam Integer quantity) {
        return ResponseEntity.ok(cartService.updateCartItem(id, quantity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> removeFromCart(@PathVariable Long id) {
        cartService.removeFromCart(id);
        return ResponseEntity.ok(new MessageResponse("Item removed from cart"));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<MessageResponse> clearCart() {
        cartService.clearCart();
        return ResponseEntity.ok(new MessageResponse("Cart cleared"));
    }
}