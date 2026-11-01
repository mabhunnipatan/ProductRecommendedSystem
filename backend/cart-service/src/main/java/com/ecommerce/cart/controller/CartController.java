package com.ecommerce.cart.controller;

import com.ecommerce.cart.dto.AddToCartRequest;
import com.ecommerce.cart.dto.CartSummary;
import com.ecommerce.cart.dto.OrderResponse;
import com.ecommerce.cart.entity.CartItem;
import com.ecommerce.cart.service.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Long) {
            return (Long) authentication.getPrincipal();
        }
        throw new RuntimeException("User not authenticated");
    }

    @GetMapping
    public ResponseEntity<CartSummary> getCart() {
        Long userId = getCurrentUserId();
        CartSummary cart = cartService.getCart(userId);
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(@RequestBody AddToCartRequest request) {
        Long userId = getCurrentUserId();
        CartItem item = cartService.addToCart(userId, request);
        return ResponseEntity.ok(item);
    }

    @PutMapping("/update/{productId}")
    public ResponseEntity<?> updateQuantity(@PathVariable Long productId,
                                            @RequestParam Integer quantity) {
        Long userId = getCurrentUserId();
        CartItem updated = cartService.updateQuantity(userId, productId, quantity);
        if (updated == null) {
            return ResponseEntity.ok().body(java.util.Map.of("message", "Item removed from cart"));
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long productId) {
        Long userId = getCurrentUserId();
        cartService.removeFromCart(userId, productId);
        return ResponseEntity.ok().body(java.util.Map.of("message", "Item removed from cart"));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart() {
        Long userId = getCurrentUserId();
        cartService.clearCart(userId);
        return ResponseEntity.ok().body(java.util.Map.of("message", "Cart cleared successfully"));
    }

    @PostMapping("/checkout")
    public ResponseEntity<OrderResponse> checkout() {
        Long userId = getCurrentUserId();
        OrderResponse response = cartService.checkout(userId);
        return ResponseEntity.ok(response);
    }
}
