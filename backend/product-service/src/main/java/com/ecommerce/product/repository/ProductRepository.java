package com.ecommerce.product.repository;

import com.ecommerce.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByIsActiveTrue(Pageable pageable);

    Page<Product> findByCategoryIdAndIsActiveTrue(Long categoryId, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCaseAndIsActiveTrue(String keyword, Pageable pageable);

    Page<Product> findByPriceBetweenAndIsActiveTrue(BigDecimal min, BigDecimal max, Pageable pageable);

    Page<Product> findByTagsContainingIgnoreCase(String tag, Pageable pageable);

    Page<Product> findByBrandIgnoreCaseAndIsActiveTrue(String brand, Pageable pageable);

    List<Product> findByIsFeaturedTrueAndIsActiveTrue();

    Page<Product> findByRatingGreaterThanEqualAndIsActiveTrue(Double rating, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.isActive = true AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.tags) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.brand) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Product> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT DISTINCT p.brand FROM Product p WHERE p.brand IS NOT NULL AND p.isActive = true ORDER BY p.brand")
    List<String> findDistinctBrands();
}
