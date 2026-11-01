package com.ecommerce.cart.service;

import com.ecommerce.cart.dto.AddToCartRequest;
import com.ecommerce.cart.dto.CartSummary;
import com.ecommerce.cart.dto.OrderResponse;
import com.ecommerce.cart.entity.CartItem;
import com.ecommerce.cart.repository.CartItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;

    public CartSummary getCart(Long userId) {
        List<CartItem> items = cartItemRepository.findByUserId(userId);
        int totalItems = items.stream().mapToInt(CartItem::getQuantity).sum();
        BigDecimal totalAmount = items.stream()
                .map(item -> item.getProductPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartSummary.builder()
                .items(items)
                .totalItems(totalItems)
                .totalAmount(totalAmount)
                .build();
    }

    @Transactional
    public CartItem addToCart(Long userId, AddToCartRequest request) {
        Optional<CartItem> existing = cartItemRepository.findByUserIdAndProductId(userId, request.getProductId());

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            item.setProductPrice(request.getProductPrice());
            item.setProductName(request.getProductName());
            item.setProductImage(request.getProductImage());
            return cartItemRepository.save(item);
        }

        CartItem newItem = CartItem.builder()
                .userId(userId)
                .productId(request.getProductId())
                .productName(request.getProductName())
                .productImage(request.getProductImage())
                .productPrice(request.getProductPrice())
                .quantity(request.getQuantity() != null ? request.getQuantity() : 1)
                .build();

        return cartItemRepository.save(newItem);
    }

    @Transactional
    public CartItem updateQuantity(Long userId, Long productId, Integer quantity) {
        CartItem item = cartItemRepository.findByUserIdAndProductId(userId, productId)
                .orElseThrow(() -> new RuntimeException("Cart item not found for productId: " + productId));

        if (quantity <= 0) {
            cartItemRepository.deleteByUserIdAndProductId(userId, productId);
            return null;
        }

        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }

    @Transactional
    public void removeFromCart(Long userId, Long productId) {
        cartItemRepository.deleteByUserIdAndProductId(userId, productId);
        log.info("Removed product {} from cart of user {}", productId, userId);
    }

    @Transactional
    public void clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
        log.info("Cleared cart for user {}", userId);
    }

    @Transactional
    public OrderResponse checkout(Long userId) {
        CartSummary cartSummary = getCart(userId);

        if (cartSummary.getItems().isEmpty()) {
            return OrderResponse.builder()
                    .orderId(null)
                    .message("Cart is empty. Please add items before checkout.")
                    .totalAmount(BigDecimal.ZERO)
                    .status("FAILED")
                    .build();
        }

        BigDecimal totalAmount = cartSummary.getTotalAmount();
        String orderId = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        clearCart(userId);

        log.info("Order {} placed successfully for user {} with total {}", orderId, userId, totalAmount);

        return OrderResponse.builder()
                .orderId(orderId)
                .message("Order placed successfully! Thank you for your purchase.")
                .totalAmount(totalAmount)
                .status("SUCCESS")
                .build();
    }
}
