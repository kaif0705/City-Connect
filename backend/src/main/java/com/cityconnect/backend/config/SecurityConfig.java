package com.cityconnect.backend.config;

import com.cityconnect.backend.security.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
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
                // 1. Disable CSRF (Cross-Site Request Forgery)
                .csrf(AbstractHttpConfigurer::disable)

                // 2. Set session management to STATELESS
                // We are using JWTs, not sessions
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 3. Define authorization rules for our endpoints
                .authorizeHttpRequests(auth -> auth
                        // 3a. Public endpoints (everyone can access)
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers("/hello-world").permitAll() // Your test endpoint
                        .requestMatchers("/api/v1/data/**").permitAll() // Utility endpoints
                        .requestMatchers("/h2-console/**").permitAll() // H2 Console

                        // 3b. Citizen-only endpoints
                        .requestMatchers("/api/v1/issues/**").hasRole("CITIZEN")

                        // 3c. Admin-only endpoints
                        .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")

                        // 3d. All other requests must be authenticated
                        .anyRequest().authenticated()
                );

        // 4. Add our custom JWT filter
        // This will run *before* the default Spring authentication filter
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        // 5. Fix for H2 console (allows it to be shown in a frame)
        http.headers(headers -> headers.frameOptions(frameOptions -> frameOptions.sameOrigin()));

        return http.build();
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