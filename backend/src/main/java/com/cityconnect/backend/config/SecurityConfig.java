package com.cityconnect.backend.config;

import com.cityconnect.backend.security.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Enables @PreAuthorize on our controllers
public class SecurityConfig {

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    /**
     * This is the main configuration for all security in the app.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Disable CSRF
                .csrf(AbstractHttpConfigurer::disable)

                // 2. Enable our Global CORS Bean
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 3. Set session management to STATELESS
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 4. Define authorization rules
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints (everyone can access)
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers("/hello-world").permitAll()
                        .requestMatchers("/api/v1/data/**").permitAll()
                        .requestMatchers("/h2-console/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/media/**").permitAll() // Allows everyone to VIEW images

                        // --- THIS IS THE FIX/UPDATE for Step 13 ---
                        // Citizen & Admin endpoints (for creating, viewing self, viewing details)
                        .requestMatchers("/api/v1/issues/**").hasAnyRole("CITIZEN", "ADMIN")

                        // User (Citizen or Admin) endpoints
                        .requestMatchers("/api/v1/files/upload").hasAnyRole("CITIZEN", "ADMIN") // Secures file uploads

                        // Admin-only endpoints
                        .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")

                        // All other requests must be authenticated
                        .anyRequest().authenticated()
                );

        // 5. Add our custom JWT filter
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        // 6. Fix for H2 console
        http.headers(headers -> headers.frameOptions(frameOptions -> frameOptions.sameOrigin()));

        return http.build();
    }

    /**
     * Creates a Global CORS configuration bean.
     * This allows requests from our frontend (running on http://localhost:5173).
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Allow our frontend to connect
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        // Allow all standard methods
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // Allow all standard headers
        configuration.setAllowedHeaders(List.of("*"));
        // Allow credentials (like cookies, though we use tokens)
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Apply this configuration to all paths
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }


    /**
     * Creates a PasswordEncoder bean to hash and verify passwords.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Exposes the AuthenticationManager bean
     * Used by our AuthService to process a login attempt.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}