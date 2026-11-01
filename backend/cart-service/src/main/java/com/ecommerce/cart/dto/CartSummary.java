package com.ecommerce.cart.dto;

import com.ecommerce.cart.entity.CartItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartSummary {
    private List<CartItem> items;
    private Integer totalItems;
    private BigDecimal totalAmount;
}
