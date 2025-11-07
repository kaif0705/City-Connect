package com.cityconnect.backend.repository;

import com.cityconnect.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // This is the most important method for Spring Security.
    // It will be used by UserDetailsServiceImpl to load a user by their username.
    Optional<User> findByUsername(String username);

    // We need these for our registration service (AuthService) to check for duplicates.
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
}