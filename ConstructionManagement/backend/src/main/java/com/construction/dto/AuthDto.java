package com.construction.dto;

import com.construction.entity.User;
import lombok.Data;

public class AuthDto {
    @Data
    public static class RegisterRequest {
        private String username;
        private String email;
        private String password;
        private String fullName;
        private String phone;
        private User.Role role;
    }

    @Data
    public static class LoginRequest {
        private String username;
        private String password;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private String username;
        private String email;
        private String fullName;
        private User.Role role;
        private Long id;

        public AuthResponse(String token, User user) {
            this.token = token;
            this.username = user.getUsername();
            this.email = user.getEmail();
            this.fullName = user.getFullName();
            this.role = user.getRole();
            this.id = user.getId();
        }
    }
}
