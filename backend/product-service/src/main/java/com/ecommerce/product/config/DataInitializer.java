package com.ecommerce.product.config;

import com.ecommerce.product.entity.Category;
import com.ecommerce.product.entity.Product;
import com.ecommerce.product.repository.CategoryRepository;
import com.ecommerce.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Override
    public void run(String... args) {
        if (categoryRepository.count() == 0) {
            initCategories();
        }
        if (productRepository.count() == 0) {
            initProducts();
        }
    }

    private void initCategories() {
        log.info("Initializing categories...");
        List<Category> categories = List.of(
            Category.builder().name("Electronics").description("Latest gadgets and electronic devices").icon("📱").build(),
            Category.builder().name("Clothing").description("Fashion and apparel for everyone").icon("👗").build(),
            Category.builder().name("Books").description("Best books across all genres").icon("📚").build(),
            Category.builder().name("Home & Kitchen").description("Everything for your home").icon("🏠").build(),
            Category.builder().name("Sports").description("Sports equipment and fitness gear").icon("⚽").build(),
            Category.builder().name("Beauty").description("Beauty and personal care products").icon("💄").build()
        );
        categoryRepository.saveAll(categories);
        log.info("Categories initialized successfully.");
    }

    private void initProducts() {
        log.info("Initializing products...");

        Category electronics = categoryRepository.findByName("Electronics").orElseThrow();
        Category clothing    = categoryRepository.findByName("Clothing").orElseThrow();
        Category books       = categoryRepository.findByName("Books").orElseThrow();
        Category homeKitchen = categoryRepository.findByName("Home & Kitchen").orElseThrow();
        Category sports      = categoryRepository.findByName("Sports").orElseThrow();
        Category beauty      = categoryRepository.findByName("Beauty").orElseThrow();

        List<Product> products = List.of(

            // ── Electronics ──────────────────────────────────────────────
            product("iPhone 15 Pro",
                "The most advanced iPhone with A17 Pro chip, titanium design and ProMotion display.",
                99999, 119999, "Apple",
                "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500",
                "smartphone,apple,flagship,ios", electronics, 4.8, 45200, 120, true),

            product("Samsung Galaxy S24 Ultra",
                "Next-level Galaxy with Snapdragon 8 Gen 3, AI-powered camera and integrated S Pen.",
                89999, 107999, "Samsung",
                "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500",
                "smartphone,samsung,android,ai", electronics, 4.7, 38000, 90, true),

            product("MacBook Pro 14",
                "Supercharged by M3 chip with Liquid Retina XDR display and all-day battery life.",
                169999, 203999, "Apple",
                "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
                "laptop,apple,macbook,m3,productivity", electronics, 4.9, 22100, 45, true),

            product("Sony WH-1000XM5 Headphones",
                "Industry-leading noise cancellation with 30-hour battery life and premium sound.",
                24999, 29999, "Sony",
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
                "headphones,sony,noise-cancelling,wireless", electronics, 4.7, 51000, 200, false),

            product("iPad Air M2",
                "Powerful M2 chip in a thin and light design with stunning Liquid Retina display.",
                59999, 71999, "Apple",
                "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500",
                "tablet,apple,ipad", electronics, 4.6, 18500, 75, false),

            product("GoPro Hero 12",
                "Waterproof action camera with 5.3K video, HyperSmooth 6.0 stabilization.",
                34999, 41999, "GoPro",
                "https://images.unsplash.com/photo-1606986628253-c7e4e62e6c80?w=500",
                "camera,gopro,action,waterproof", electronics, 4.6, 12400, 110, false),

            product("Dell XPS 15",
                "Premium Windows laptop with InfinityEdge OLED display and 13th Gen Intel Core i9.",
                149999, 179999, "Dell",
                "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500",
                "laptop,dell,gaming,productivity", electronics, 4.5, 9800, 35, false),

            // ── Clothing ──────────────────────────────────────────────────
            product("Nike Air Max 270",
                "Lightweight everyday shoe with Max Air cushioning for all-day comfort.",
                8999, 10799, "Nike",
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
                "shoes,nike,sneakers,sports", clothing, 4.5, 34600, 250, true),

            product("Levi's 501 Original Jeans",
                "The original straight leg jean. Button fly, 100% cotton denim.",
                4999, 5999, "Levi's",
                "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
                "jeans,levis,denim,casual", clothing, 4.4, 28700, 400, false),

            product("Adidas Ultraboost 23",
                "Energy-returning Boost cushioning with a Primeknit+ upper for long runs.",
                12999, 15599, "Adidas",
                "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500",
                "shoes,adidas,running,boost", clothing, 4.6, 21300, 180, true),

            product("Zara Summer Dress",
                "Flowy midi dress with floral print, perfect for summer outings.",
                2999, 3599, "Zara",
                "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500",
                "dress,zara,summer,women", clothing, 4.2, 15600, 300, false),

            product("H&M Slim Fit Shirt",
                "Classic slim fit shirt in soft cotton blend, ideal for office or casual wear.",
                1299, 1559, "H&M",
                "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500",
                "shirt,formal,men", clothing, 4.1, 9200, 500, false),

            // ── Books ─────────────────────────────────────────────────────
            product("Atomic Habits",
                "An Easy & Proven Way to Build Good Habits & Break Bad Ones by James Clear.",
                499, 599, "James Clear",
                "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500",
                "self-help,habits,productivity,bestseller", books, 4.8, 86500, 800, true),

            product("The Psychology of Money",
                "Timeless lessons on wealth, greed, and happiness by Morgan Housel.",
                399, 479, "Morgan Housel",
                "https://images.unsplash.com/photo-1554774853-b415df9eeb92?w=500",
                "finance,money,investing", books, 4.7, 62000, 600, false),

            product("Dune",
                "Frank Herbert's epic science fiction masterpiece, the best-selling sci-fi novel ever.",
                349, 419, "Frank Herbert",
                "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500",
                "sci-fi,fiction,classic", books, 4.6, 41200, 400, false),

            product("Clean Code",
                "A Handbook of Agile Software Craftsmanship by Robert C. Martin.",
                799, 959, "Robert C. Martin",
                "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500",
                "programming,coding,software,tech", books, 4.5, 33800, 300, false),

            // ── Home & Kitchen ─────────────────────────────────────────────
            product("Dyson V15 Detect Vacuum",
                "Laser reveals invisible dust. Automatically adapts suction power to floor type.",
                54999, 65999, "Dyson",
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
                "vacuum,dyson,home,cleaning", homeKitchen, 4.7, 8900, 55, true),

            product("Instant Pot Duo 7-in-1",
                "7-in-1 electric pressure cooker, slow cooker, rice cooker, steamer, sauté, warmer.",
                8999, 10799, "Instant Pot",
                "https://images.unsplash.com/photo-1585515320310-259814833e62?w=500",
                "kitchen,cooking,home", homeKitchen, 4.6, 24600, 140, false),

            product("Philips Hue Starter Kit",
                "Smart bulbs with full colour and White Ambiance control via Hue app.",
                7999, 9599, "Philips",
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
                "smart-home,lighting,iot", homeKitchen, 4.4, 11200, 90, false),

            product("IKEA BILLY Bookcase",
                "Classic adjustable bookcase in white finish, perfect for any room.",
                4999, 5999, "IKEA",
                "https://images.unsplash.com/photo-1493663284031-b7e3aaa4e3e4?w=500",
                "furniture,bookcase,storage,home-decor", homeKitchen, 4.3, 19400, 70, false),

            // ── Sports ─────────────────────────────────────────────────────
            product("Yoga Mat Premium",
                "6mm thick non-slip eco-friendly yoga mat with carrying strap.",
                1999, 2399, "Liforme",
                "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=500",
                "yoga,fitness,exercise", sports, 4.5, 17800, 350, false),

            product("Whey Protein Isolate MyProtein",
                "90% protein content, ultra-fast absorbing isolate for lean muscle growth.",
                3499, 4199, "MyProtein",
                "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500",
                "protein,fitness,gym,supplement", sports, 4.4, 28500, 220, false),

            product("Resistance Band Set",
                "5-level resistance bands with door anchor, handles and ankle straps for full body.",
                1499, 1799, "Boldfit",
                "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500",
                "fitness,home-gym,exercise", sports, 4.3, 22100, 400, false),

            product("Garmin Forerunner 265",
                "Running smartwatch with AMOLED display, training readiness and race predictor.",
                34999, 41999, "Garmin",
                "https://images.unsplash.com/photo-1523475496153-3206d9f3e014?w=500",
                "smartwatch,garmin,gps,fitness", sports, 4.7, 7200, 60, true),

            product("Garmin Vivoactive 5",
                "Health and fitness smartwatch with built-in GPS, 25 sports apps and 11-day battery.",
                24999, 29999, "Garmin",
                "https://images.unsplash.com/photo-1523475496153-3206d9f3e014?w=500",
                "smartwatch,garmin,fitness,health", sports, 4.5, 5800, 80, false),

            // ── Beauty ─────────────────────────────────────────────────────
            product("The Ordinary Niacinamide 10% + Zinc 1%",
                "High-strength vitamin and mineral blemish formula for oily and congested skin.",
                599, 719, "The Ordinary",
                "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500",
                "skincare,serum,beauty", beauty, 4.5, 48200, 600, false),

            product("Maybelline Fit Me Foundation",
                "Natural finish foundation with SPF 18, available in 40 shades.",
                799, 959, "Maybelline",
                "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500",
                "foundation,makeup,beauty,cosmetics", beauty, 4.3, 36700, 500, false),

            product("Forest Essentials Face Wash",
                "Ayurvedic facial cleanser with pure honey, neem and rose extracts.",
                1299, 1559, "Forest Essentials",
                "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500",
                "face-wash,natural,skincare", beauty, 4.4, 12300, 250, false),

            product("Dyson Airwrap Multi-Styler",
                "Styles and dries simultaneously using airflow instead of extreme heat.",
                44999, 53999, "Dyson",
                "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500",
                "hair,dyson,styling,beauty", beauty, 4.6, 9800, 40, true),

            product("Biotique Bio Almond Oil",
                "100% pure cold-pressed almond oil for hair and skin nourishment.",
                399, 479, "Biotique",
                "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500",
                "oil,natural,hair-care,skin-care", beauty, 4.2, 18900, 350, false)
        );

        productRepository.saveAll(products);
        log.info("Products initialized successfully ({} products).", products.size());
    }

    private Product product(String name, String description, long price, long originalPrice,
                             String brand, String imageUrl, String tags,
                             Category category, double rating, int reviewCount,
                             int stock, boolean featured) {
        return Product.builder()
                .name(name)
                .description(description)
                .price(BigDecimal.valueOf(price))
                .originalPrice(BigDecimal.valueOf(originalPrice))
                .brand(brand)
                .imageUrl(imageUrl)
                .tags(tags)
                .category(category)
                .rating(rating)
                .reviewCount(reviewCount)
                .stock(stock)
                .isFeatured(featured)
                .isActive(true)
                .build();
    }
}
