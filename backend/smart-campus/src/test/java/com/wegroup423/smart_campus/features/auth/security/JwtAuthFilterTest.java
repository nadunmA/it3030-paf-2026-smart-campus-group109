package com.wegroup423.smart_campus.features.auth.security;


import com.wegroup423.smart_campus.features.auth.model.User;
import com.wegroup423.smart_campus.features.auth.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JwtAuthFilterTest {

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private UserRepository userRepository;

    @Mock
    private FilterChain filterChain;

    @InjectMocks
    private JwtAuthFilter jwtAuthFilter;

    private User activeUser;
    private User inactiveUser;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.clearContext();

        activeUser = User.builder()
                .id("user-123")
                .email("nadun@gmail.com")
                .name("Nadun")
                .password("hashed-password")
                .role(User.Role.USER)
                .active(true)
                .createdAt(LocalDateTime.now().minusDays(5))
                .build();

        inactiveUser = User.builder()
                .id("user-999")
                .email("inactive@gmail.com")
                .name("Inactive User")
                .role(User.Role.ADMIN)
                .active(false)
                .createdAt(LocalDateTime.now().minusDays(10))
                .build();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void doFilterInternal_shouldSetAuthentication_whenTokenIsValidAndUserIsActive()
            throws ServletException, IOException {

        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        request.addHeader("Authorization", "Bearer valid-token");

        when(jwtUtil.validateToken("valid-token")).thenReturn(true);
        when(jwtUtil.getUserIdFromToken("valid-token")).thenReturn("user-123");
        when(userRepository.findById("user-123")).thenReturn(Optional.of(activeUser));

        jwtAuthFilter.doFilterInternal(request, response, filterChain);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        assertNotNull(authentication);
        assertEquals("user-123", authentication.getPrincipal());
        assertEquals(1, authentication.getAuthorities().size());
        assertTrue(authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_USER")));

        verify(jwtUtil).validateToken("valid-token");
        verify(jwtUtil).getUserIdFromToken("valid-token");
        verify(userRepository).findById("user-123");
        verify(filterChain).doFilter(request, response);
    }

    @Test
    void doFilterInternal_shouldNotSetAuthentication_whenAuthorizationHeaderIsMissing()
            throws ServletException, IOException {

        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        jwtAuthFilter.doFilterInternal(request, response, filterChain);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        assertNull(authentication);

        verify(jwtUtil, never()).validateToken(anyString());
        verify(userRepository, never()).findById(anyString());
        verify(filterChain).doFilter(request, response);
    }

    @Test
    void doFilterInternal_shouldNotSetAuthentication_whenAuthorizationHeaderDoesNotStartWithBearer()
            throws ServletException, IOException {

        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        request.addHeader("Authorization", "Basic some-basic-token");

        jwtAuthFilter.doFilterInternal(request, response, filterChain);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        assertNull(authentication);

        verify(jwtUtil, never()).validateToken(anyString());
        verify(userRepository, never()).findById(anyString());
        verify(filterChain).doFilter(request, response);
    }

    @Test
    void doFilterInternal_shouldNotSetAuthentication_whenTokenIsInvalid()
            throws ServletException, IOException {

        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        request.addHeader("Authorization", "Bearer invalid-token");

        when(jwtUtil.validateToken("invalid-token")).thenReturn(false);

        jwtAuthFilter.doFilterInternal(request, response, filterChain);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        assertNull(authentication);

        verify(jwtUtil).validateToken("invalid-token");
        verify(jwtUtil, never()).getUserIdFromToken(anyString());
        verify(userRepository, never()).findById(anyString());
        verify(filterChain).doFilter(request, response);
    }

    @Test
    void doFilterInternal_shouldClearContext_whenUserIsInactive()
            throws ServletException, IOException {

        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        request.addHeader("Authorization", "Bearer valid-token");

        when(jwtUtil.validateToken("valid-token")).thenReturn(true);
        when(jwtUtil.getUserIdFromToken("valid-token")).thenReturn("user-999");
        when(userRepository.findById("user-999")).thenReturn(Optional.of(inactiveUser));

        jwtAuthFilter.doFilterInternal(request, response, filterChain);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        assertNull(authentication);

        verify(jwtUtil).validateToken("valid-token");
        verify(jwtUtil).getUserIdFromToken("valid-token");
        verify(userRepository).findById("user-999");
        verify(filterChain).doFilter(request, response);
    }

    @Test
    void doFilterInternal_shouldClearContext_whenUserIsNotFound()
            throws ServletException, IOException {

        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        request.addHeader("Authorization", "Bearer valid-token");

        when(jwtUtil.validateToken("valid-token")).thenReturn(true);
        when(jwtUtil.getUserIdFromToken("valid-token")).thenReturn("missing-user");
        when(userRepository.findById("missing-user")).thenReturn(Optional.empty());

        jwtAuthFilter.doFilterInternal(request, response, filterChain);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        assertNull(authentication);

        verify(jwtUtil).validateToken("valid-token");
        verify(jwtUtil).getUserIdFromToken("valid-token");
        verify(userRepository).findById("missing-user");
        verify(filterChain).doFilter(request, response);
    }

    @Test
    void doFilterInternal_shouldSetAdminRole_whenUserRoleIsAdmin()
            throws ServletException, IOException {

        User adminUser = User.builder()
                .id("admin-1")
                .email("admin@gmail.com")
                .name("Admin")
                .role(User.Role.ADMIN)
                .active(true)
                .createdAt(LocalDateTime.now())
                .build();

        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        request.addHeader("Authorization", "Bearer admin-token");

        when(jwtUtil.validateToken("admin-token")).thenReturn(true);
        when(jwtUtil.getUserIdFromToken("admin-token")).thenReturn("admin-1");
        when(userRepository.findById("admin-1")).thenReturn(Optional.of(adminUser));

        jwtAuthFilter.doFilterInternal(request, response, filterChain);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        assertNotNull(authentication);
        assertTrue(authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")));

        verify(filterChain).doFilter(request, response);
    }
}
