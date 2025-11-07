package com.cityconnect.backend.config;

import com.cityconnect.backend.security.JwtUtil;
import com.cityconnect.backend.security.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * This filter runs once per request.
 * It intercepts all requests to check for a JWT in the 'Authorization' header.
 * If a valid token is found, it sets the user's authentication
 * in the Spring Security Context.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            // 1. Get the JWT from the request
            String jwt = getJwtFromRequest(request);

            // 2. Validate the token
            if (StringUtils.hasText(jwt) && jwtUtil.validateToken(jwt)) {
                // 3. Get username from token
                String username = jwtUtil.getUsernameFromToken(jwt);

                // 4. Load user details from the database
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                // 5. Create an authentication token
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 6. Set the authentication in the Spring Security Context
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ex) {
            logger.error("Could not set user authentication in security context", ex);
        }

        // 7. Continue the filter chain
        filterChain.doFilter(request, response);
    }

    /**
     * Helper method to extract the "Bearer" token from the
     * 'Authorization' header.
     */
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}