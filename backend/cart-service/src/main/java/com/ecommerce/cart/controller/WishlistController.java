package com.ecommerce.cart.controller;

import com.ecommerce.cart.dto.AddToCartRequest;
import com.ecommerce.cart.entity.Wishlist;
import com.ecommerce.cart.service.WishlistService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Long) {
            return (Long) authentication.getPrincipal();
        }
        throw new RuntimeException("User not authenticated");
    }

    @GetMapping
    public ResponseEntity<List<Wishlist>> getWishlist() {
        Long userId = getCurrentUserId();
        List<Wishlist> wishlist = wishlistService.getWishlist(userId);
        return ResponseEntity.ok(wishlist);
    }

    @PostMapping("/toggle")
    public ResponseEntity<Map<String, Object>> toggleWishlist(@RequestBody AddToCartRequest request) {
        Long userId = getCurrentUserId();
        boolean added = wishlistService.toggleWishlist(userId, request);
        return ResponseEntity.ok(Map.of(
                "added", added,
                "message", added ? "Item added to wishlist" : "Item removed from wishlist"
        ));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Map<String, String>> removeFromWishlist(@PathVariable Long productId) {
        Long userId = getCurrentUserId();
        wishlistService.removeFromWishlist(userId, productId);
        return ResponseEntity.ok(Map.of("message", "Item removed from wishlist"));
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<Map<String, Boolean>> checkIfInWishlist(@PathVariable Long productId) {
        Long userId = getCurrentUserId();
        boolean inWishlist = wishlistService.isInWishlist(userId, productId);
        return ResponseEntity.ok(Map.of("inWishlist", inWishlist));
    }
}
