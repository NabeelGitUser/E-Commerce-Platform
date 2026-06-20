// FILE: src/main/java/com/amazoff/backend/service/CartService.java
// ===========================================
package com.amazoff.backend.service;

import com.amazoff.backend.dto.CartItemRequest;
import com.amazoff.backend.dto.CartItemResponse;
import com.amazoff.backend.entity.CartItem;
import com.amazoff.backend.entity.Product;
import com.amazoff.backend.entity.User;
import com.amazoff.backend.repository.CartItemRepository;
import com.amazoff.backend.repository.ProductRepository;
import com.amazoff.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public CartItemResponse addToCart(CartItemRequest request) {
        User user = getCurrentUser();
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem cartItem = cartItemRepository.findByUserAndProduct(user, product)
                .map(existing -> {
                    existing.setQuantity(existing.getQuantity() + request.getQuantity());
                    return existing;
                })
                .orElseGet(() -> {
                    CartItem newItem = new CartItem();
                    newItem.setUser(user);
                    newItem.setProduct(product);
                    newItem.setQuantity(request.getQuantity());
                    return newItem;
                });

        return new CartItemResponse(cartItemRepository.save(cartItem));
    }

    public List<CartItemResponse> getCartItems() {
        User user = getCurrentUser();
        return cartItemRepository.findByUser(user).stream()
                .map(CartItemResponse::new)
                .collect(Collectors.toList());
    }

    public void removeFromCart(Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        User user = getCurrentUser();
        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        cartItemRepository.delete(cartItem);
    }

    public CartItemResponse updateCartItem(Long cartItemId, Integer quantity) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        User user = getCurrentUser();
        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        cartItem.setQuantity(quantity);
        return new CartItemResponse(cartItemRepository.save(cartItem));
    }

    @Transactional
    public void clearCart() {
        User user = getCurrentUser();
        cartItemRepository.deleteByUser(user);
    }
}