package com.wegroup423.smart_campus.service;



import com.wegroup423.smart_campus.entity.User;
import com.wegroup423.smart_campus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String googleId = oAuth2User.getAttribute("sub");
        String email    = oAuth2User.getAttribute("email");
        String name     = oAuth2User.getAttribute("name");
        String picture  = oAuth2User.getAttribute("picture");

        log.debug("OAuth2 login attempt: email={}", email);

        // Find existing user or create new one
        User user = userRepository.findByEmail(email)
                .map(existingUser -> {
                    // Update last login + info
                    existingUser.setLastLoginAt(LocalDateTime.now());
                    existingUser.setName(name);
                    existingUser.setPicture(picture);
                    existingUser.setGoogleId(googleId);
                    return userRepository.save(existingUser);
                })
                .orElseGet(() -> {
                    // First time login — auto register
                    log.info("New user registered via Google: {}", email);
                    User newUser = User.builder()
                            .email(email)
                            .name(name)
                            .picture(picture)
                            .googleId(googleId)
                            .role(User.Role.USER)
                            .lastLoginAt(LocalDateTime.now())
                            .build();
                    return userRepository.save(newUser);
                });

        return oAuth2User;
    }
}