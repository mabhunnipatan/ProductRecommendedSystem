package com.ecommerce.cart.service;

import com.ecommerce.cart.dto.AddToCartRequest;
import com.ecommerce.cart.entity.Wishlist;
import com.ecommerce.cart.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;

    public List<Wishlist> getWishlist(Long userId) {
        return wishlistRepository.findByUserId(userId);
    }

    @Transactional
    public boolean toggleWishlist(Long userId, AddToCartRequest request) {
        Optional<Wishlist> existing = wishlistRepository.findByUserIdAndProductId(userId, request.getProductId());

        if (existing.isPresent()) {
            wishlistRepository.deleteByUserIdAndProductId(userId, request.getProductId());
            log.info("Removed product {} from wishlist of user {}", request.getProductId(), userId);
            return false; // removed
        }

        Wishlist wishlistItem = Wishlist.builder()
                .userId(userId)
                .productId(request.getProductId())
                .productName(request.getProductName())
                .productImage(request.getProductImage())
                .productPrice(request.getProductPrice())
                .build();

        wishlistRepository.save(wishlistItem);
        log.info("Added product {} to wishlist of user {}", request.getProductId(), userId);
        return true; // added
    }

    public boolean isInWishlist(Long userId, Long productId) {
        return wishlistRepository.existsByUserIdAndProductId(userId, productId);
    }

    @Transactional
    public void removeFromWishlist(Long userId, Long productId) {
        wishlistRepository.deleteByUserIdAndProductId(userId, productId);
        log.info("Removed product {} from wishlist of user {}", productId, userId);
    }
}
