package com.ecommerce.recommendation.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_events")
public class UserEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long productId;

    /**
     * Event types: VIEW, LIKE, ADD_TO_CART, PURCHASE, SEARCH_CLICK
     */
    @Column(nullable = false)
    private String eventType;

    @Column
    private Long categoryId;

    @Column(columnDefinition = "TEXT")
    private String tags;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
