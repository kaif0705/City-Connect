package com.cityconnect.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Data
@Entity
@Table(name = "users") // Note: "user" is often a reserved keyword in SQL
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password; // This will be stored as a hash

    @Column(nullable = false)
    private String role; // e.g., "ROLE_CITIZEN", "ROLE_ADMIN"

    //A single user can have multiple Issues raised
    @OneToMany(mappedBy = "user")
    private List<Issue> issues;


    // --- UserDetails Interface Methods ---
    // These methods are required by Spring Security

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // We convert our simple "role" string into a GrantedAuthority
        return List.of(new SimpleGrantedAuthority(this.role));
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    // We can hardcode these to 'true' for simplicity in our hackathon
    // In a real app, you might check for "isBanned" or "isEmailVerified"
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}