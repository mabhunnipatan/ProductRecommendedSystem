package com.ecommerce.product.service;

import com.ecommerce.product.dto.ProductRequest;
import com.ecommerce.product.entity.Category;
import com.ecommerce.product.entity.Product;
import com.ecommerce.product.entity.ProductView;
import com.ecommerce.product.repository.CategoryRepository;
import com.ecommerce.product.repository.ProductRepository;
import com.ecommerce.product.repository.ProductViewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductViewRepository productViewRepository;

    public Page<Product> getAllProducts(int page, int size, String sortBy) {
        Sort sort = buildSort(sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return productRepository.findByIsActiveTrue(pageable);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    public Page<Product> searchProducts(String keyword, Long categoryId, BigDecimal minPrice,
                                        BigDecimal maxPrice, Double minRating, String brand,
                                        String sortBy, int page, int size) {
        Sort sort = buildSort(sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        // Keyword search
        if (StringUtils.hasText(keyword)) {
            Page<Product> results = productRepository.searchByKeyword(keyword, pageable);

            // Apply in-memory filters if needed
            if (categoryId != null || minPrice != null || maxPrice != null || minRating != null || StringUtils.hasText(brand)) {
                List<Product> filtered = results.getContent().stream()
                        .filter(p -> categoryId == null || (p.getCategory() != null && p.getCategory().getId().equals(categoryId)))
                        .filter(p -> minPrice == null || p.getPrice().compareTo(minPrice) >= 0)
                        .filter(p -> maxPrice == null || p.getPrice().compareTo(maxPrice) <= 0)
                        .filter(p -> minRating == null || (p.getRating() != null && p.getRating() >= minRating))
                        .filter(p -> !StringUtils.hasText(brand) || brand.equalsIgnoreCase(p.getBrand()))
                        .collect(Collectors.toList());
                return new PageImpl<>(filtered, pageable, filtered.size());
            }
            return results;
        }

        // Filter by category
        if (categoryId != null) {
            Page<Product> results = productRepository.findByCategoryIdAndIsActiveTrue(categoryId, pageable);
            if (minPrice != null || maxPrice != null || minRating != null || StringUtils.hasText(brand)) {
                List<Product> filtered = applyPriceRatingBrandFilters(results.getContent(), minPrice, maxPrice, minRating, brand);
                return new PageImpl<>(filtered, pageable, filtered.size());
            }
            return results;
        }

        // Filter by brand
        if (StringUtils.hasText(brand)) {
            return productRepository.findByBrandIgnoreCaseAndIsActiveTrue(brand, pageable);
        }

        // Filter by price
        if (minPrice != null && maxPrice != null) {
            return productRepository.findByPriceBetweenAndIsActiveTrue(minPrice, maxPrice, pageable);
        }

        // Filter by rating
        if (minRating != null) {
            return productRepository.findByRatingGreaterThanEqualAndIsActiveTrue(minRating, pageable);
        }

        return productRepository.findByIsActiveTrue(pageable);
    }

    private List<Product> applyPriceRatingBrandFilters(List<Product> products, BigDecimal minPrice,
                                                        BigDecimal maxPrice, Double minRating, String brand) {
        return products.stream()
                .filter(p -> minPrice == null || p.getPrice().compareTo(minPrice) >= 0)
                .filter(p -> maxPrice == null || p.getPrice().compareTo(maxPrice) <= 0)
                .filter(p -> minRating == null || (p.getRating() != null && p.getRating() >= minRating))
                .filter(p -> !StringUtils.hasText(brand) || brand.equalsIgnoreCase(p.getBrand()))
                .collect(Collectors.toList());
    }

    public Product createProduct(ProductRequest request) {
        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found: " + request.getCategoryId()));
        }

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .originalPrice(request.getOriginalPrice())
                .imageUrl(request.getImageUrl())
                .stock(request.getStock())
                .rating(request.getRating() != null ? request.getRating() : 0.0)
                .reviewCount(request.getReviewCount() != null ? request.getReviewCount() : 0)
                .category(category)
                .tags(request.getTags())
                .brand(request.getBrand())
                .isFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : false)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();

        return productRepository.save(product);
    }

    public Product updateProduct(Long id, ProductRequest request) {
        Product existing = getProductById(id);

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found: " + request.getCategoryId()));
            existing.setCategory(category);
        }

        if (request.getName() != null) existing.setName(request.getName());
        if (request.getDescription() != null) existing.setDescription(request.getDescription());
        if (request.getPrice() != null) existing.setPrice(request.getPrice());
        if (request.getOriginalPrice() != null) existing.setOriginalPrice(request.getOriginalPrice());
        if (request.getImageUrl() != null) existing.setImageUrl(request.getImageUrl());
        if (request.getStock() != null) existing.setStock(request.getStock());
        if (request.getRating() != null) existing.setRating(request.getRating());
        if (request.getReviewCount() != null) existing.setReviewCount(request.getReviewCount());
        if (request.getTags() != null) existing.setTags(request.getTags());
        if (request.getBrand() != null) existing.setBrand(request.getBrand());
        if (request.getIsFeatured() != null) existing.setIsFeatured(request.getIsFeatured());
        if (request.getIsActive() != null) existing.setIsActive(request.getIsActive());

        return productRepository.save(existing);
    }

    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        product.setIsActive(false);
        productRepository.save(product);
    }

    public List<Product> getFeaturedProducts() {
        return productRepository.findByIsFeaturedTrueAndIsActiveTrue();
    }

    public Page<Product> getProductsByCategory(Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return productRepository.findByCategoryIdAndIsActiveTrue(categoryId, pageable);
    }

    public void recordView(Long userId, Long productId) {
        if (userId == null || productId == null) return;
        try {
            ProductView view = ProductView.builder()
                    .userId(userId)
                    .productId(productId)
                    .build();
            productViewRepository.save(view);
        } catch (Exception e) {
            log.warn("Failed to record product view: {}", e.getMessage());
        }
    }

    public List<Product> getRecommendedByTags(String tags, Long excludeProductId, int limit) {
        if (!StringUtils.hasText(tags)) return List.of();
        String[] tagArray = tags.split(",");
        String firstTag = tagArray[0].trim();

        Pageable pageable = PageRequest.of(0, limit + 1);
        Page<Product> products = productRepository.findByTagsContainingIgnoreCase(firstTag, pageable);

        return products.getContent().stream()
                .filter(p -> !p.getId().equals(excludeProductId))
                .filter(p -> Boolean.TRUE.equals(p.getIsActive()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    public List<String> getAllBrands() {
        return productRepository.findDistinctBrands();
    }

    private Sort buildSort(String sortBy) {
        if (sortBy == null) return Sort.by("createdAt").descending();
        return switch (sortBy) {
            case "price_asc" -> Sort.by("price").ascending();
            case "price_desc" -> Sort.by("price").descending();
            case "rating" -> Sort.by("rating").descending();
            case "newest" -> Sort.by("createdAt").descending();
            case "popular" -> Sort.by("reviewCount").descending();
            default -> Sort.by("createdAt").descending();
        };
    }
}
