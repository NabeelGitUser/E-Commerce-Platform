// FILE: src/main/java/com/amazoff/backend/service/OrderService.java
// REPLACE ENTIRE FILE
// ===========================================
package com.amazoff.backend.service;

import com.amazoff.backend.dto.OrderRequest;
import com.amazoff.backend.dto.OrderResponse;
import com.amazoff.backend.entity.Order;
import com.amazoff.backend.entity.Product;
import com.amazoff.backend.entity.User;
import com.amazoff.backend.repository.OrderRepository;
import com.amazoff.backend.repository.ProductRepository;
import com.amazoff.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        User user = getCurrentUser();
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getStock() < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock");
        }

        if ("CODE".equals(request.getPaymentMethod())) {
            if (!"buy".equalsIgnoreCase(request.getPaymentCode())) {
                throw new RuntimeException("Invalid payment code");
            }
        }

        Order order = new Order();
        order.setUser(user);
        order.setProduct(product);
        order.setQuantity(request.getQuantity());
        order.setTotalPrice(product.getPrice() * request.getQuantity());
        order.setStatus("ORDER_PLACED");
        order.setPaymentMethod(request.getPaymentMethod());

        product.setStock(product.getStock() - request.getQuantity());
        productRepository.save(product);

        return new OrderResponse(orderRepository.save(order));
    }

    public List<OrderResponse> getUserOrders() {
        User user = getCurrentUser();
        return orderRepository.findByUserOrderByOrderDateDesc(user).stream()
                .map(OrderResponse::new)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc().stream()
                .map(OrderResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public void cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        User user = getCurrentUser();
        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        if ("CANCELLED".equals(order.getStatus())) {
            throw new RuntimeException("Order already cancelled");
        }

        if (!"ORDER_PLACED".equals(order.getStatus())) {
            throw new RuntimeException("Cannot cancel order that has been shipped or delivered");
        }

        Product product = order.getProduct();
        product.setStock(product.getStock() + order.getQuantity());
        productRepository.save(product);

        order.setStatus("CANCELLED");
        orderRepository.save(order);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if ("CANCELLED".equals(newStatus) && !"CANCELLED".equals(order.getStatus())) {
            Product product = order.getProduct();
            product.setStock(product.getStock() + order.getQuantity());
            productRepository.save(product);
        }

        order.setStatus(newStatus);
        return new OrderResponse(orderRepository.save(order));
    }

    @Transactional
    public void deleteOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        User user = getCurrentUser();
        String userRole = user.getRole();

        if (!"ADMIN".equals(userRole) && !order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        orderRepository.delete(order);
    }
}