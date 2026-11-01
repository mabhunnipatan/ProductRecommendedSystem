package com.ecommerce.product.repository;

import com.ecommerce.product.entity.ProductView;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductViewRepository extends JpaRepository<ProductView, Long> {
    List<ProductView> findByUserIdOrderByViewedAtDesc(Long userId, Pageable pageable);
}
