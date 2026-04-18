package com.wegroup423.smart_campus.features.auth.security;


import com.wegroup423.smart_campus.features.auth.model.User;
import com.wegroup423.smart_campus.features.auth.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomOAuth2UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private OAuth2UserRequest userRequest;

    @Mock
    private OAuth2User oAuth2User;

    private CustomOAuth2UserService customOAuth2UserService;

    private User existingUser;

    @BeforeEach
    void setUp() {
        customOAuth2UserService = spy(new CustomOAuth2UserService(userRepository));

        existingUser = User.builder()
                .id("user-123")
                .email("nadun@gmail.com")
                .name("Old Name")
                .picture("old-pic")
                .googleId("old-google-id")
                .role(User.Role.USER)
                .active(true)
                .createdAt(LocalDateTime.now().minusDays(10))
                .lastLoginAt(LocalDateTime.now().minusDays(1))
                .build();
    }

    @Test
    void loadUser_shouldUpdateExistingUser_whenEmailAlreadyExists() {
        when(oAuth2User.getAttribute("sub")).thenReturn("google-123");
        when(oAuth2User.getAttribute("email")).thenReturn("nadun@gmail.com");
        when(oAuth2User.getAttribute("name")).thenReturn("Nadun Updated");
        when(oAuth2User.getAttribute("picture")).thenReturn("new-pic-url");
        doReturn(oAuth2User).when(customOAuth2UserService).fetchOAuth2User(userRequest);

        when(userRepository.findByEmail("nadun@gmail.com")).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        OAuth2User result = customOAuth2UserService.loadUser(userRequest);

        assertNotNull(result);
        assertEquals("Nadun Updated", existingUser.getName());
        assertEquals("new-pic-url", existingUser.getPicture());
        assertEquals("google-123", existingUser.getGoogleId());
        assertNotNull(existingUser.getLastLoginAt());

        verify(userRepository).findByEmail("nadun@gmail.com");
        verify(userRepository).save(existingUser);
    }

    @Test
    void loadUser_shouldCreateNewUser_whenEmailDoesNotExist() {
        when(oAuth2User.getAttribute("sub")).thenReturn("google-999");
        when(oAuth2User.getAttribute("email")).thenReturn("newuser@gmail.com");
        when(oAuth2User.getAttribute("name")).thenReturn("New User");
        when(oAuth2User.getAttribute("picture")).thenReturn("profile-pic");
        doReturn(oAuth2User).when(customOAuth2UserService).fetchOAuth2User(userRequest);

        when(userRepository.findByEmail("newuser@gmail.com")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User savedUser = invocation.getArgument(0);
            savedUser.setId("new-user-id");
            return savedUser;
        });

        OAuth2User result = customOAuth2UserService.loadUser(userRequest);

        assertNotNull(result);

        verify(userRepository).findByEmail("newuser@gmail.com");
        verify(userRepository).save(argThat(user ->
            "newuser@gmail.com".equals(user.getEmail()) &&
                "New User".equals(user.getName()) &&
                "profile-pic".equals(user.getPicture()) &&
                "google-999".equals(user.getGoogleId()) &&
                user.getRole() == User.Role.USER &&
                user.getLastLoginAt() != null
        ));
    }

    @Test
    void loadUser_shouldReturnOAuth2User_whenUserIsProcessedSuccessfully() {
        when(oAuth2User.getAttribute("sub")).thenReturn("google-123");
        when(oAuth2User.getAttribute("email")).thenReturn("nadun@gmail.com");
        when(oAuth2User.getAttribute("name")).thenReturn("Nadun");
        when(oAuth2User.getAttribute("picture")).thenReturn("pic-url");
        doReturn(oAuth2User).when(customOAuth2UserService).fetchOAuth2User(userRequest);

        when(userRepository.findByEmail("nadun@gmail.com")).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        OAuth2User result = customOAuth2UserService.loadUser(userRequest);

        assertSame(oAuth2User, result);
    }

    @Test
    void loadUser_shouldSetDefaultRoleUser_whenCreatingNewOAuthUser() {
        when(oAuth2User.getAttribute("sub")).thenReturn("google-777");
        when(oAuth2User.getAttribute("email")).thenReturn("oauthuser@gmail.com");
        when(oAuth2User.getAttribute("name")).thenReturn("OAuth User");
        when(oAuth2User.getAttribute("picture")).thenReturn("oauth-pic");
        doReturn(oAuth2User).when(customOAuth2UserService).fetchOAuth2User(userRequest);

        when(userRepository.findByEmail("oauthuser@gmail.com")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        customOAuth2UserService.loadUser(userRequest);

        verify(userRepository).save(argThat(user -> user.getRole() == User.Role.USER));
    }
}
