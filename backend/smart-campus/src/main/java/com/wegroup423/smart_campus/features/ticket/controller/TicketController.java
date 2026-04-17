package com.wegroup423.smart_campus.features.ticket.controller;

import com.wegroup423.smart_campus.features.ticket.model.dto.request.*;
import com.wegroup423.smart_campus.features.ticket.model.dto.response.TicketResponse;
import com.wegroup423.smart_campus.features.ticket.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    private String resolveUserId(Object principal) {
        if (principal instanceof com.wegroup423.smart_campus.features.auth.model.User user) {
            return user.getId();
        }
        if (principal instanceof org.springframework.security.core.userdetails.UserDetails ud) {
            return ud.getUsername();
        }
        return principal.toString();
    }

    private String resolveUserName(Object principal) {
        if (principal instanceof com.wegroup423.smart_campus.features.auth.model.User user) {
            return user.getName() != null ? user.getName() : user.getEmail();
        }
        return resolveUserId(principal);
    }

    @PostMapping
    public ResponseEntity<TicketResponse> createTicket(
            @AuthenticationPrincipal Object principal,
            @Valid @RequestBody CreateTicketRequest request) {
        String userId = resolveUserId(principal);
        String userName = resolveUserName(principal);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ticketService.createTicket(request, userId, userName));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<List<TicketResponse>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @GetMapping("/my")
    public ResponseEntity<List<TicketResponse>> getMyTickets(@AuthenticationPrincipal Object principal) {
        String userId = resolveUserId(principal);
        return ResponseEntity.ok(ticketService.getMyTickets(userId));
    }

    @GetMapping("/assigned")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<List<TicketResponse>> getAssignedTickets(@AuthenticationPrincipal Object principal) {
        String userId = resolveUserId(principal);
        return ResponseEntity.ok(ticketService.getAssignedTickets(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> getTicketById(@PathVariable String id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<TicketResponse> updateTicket(
            @AuthenticationPrincipal Object principal,
            @PathVariable String id,
            @RequestBody UpdateTicketRequest request) {
        String userId = resolveUserId(principal);
        return ResponseEntity.ok(ticketService.updateTicket(id, request, userId));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<TicketResponse> updateTicketStatus(
            @AuthenticationPrincipal Object principal,
            @PathVariable String id,
            @Valid @RequestBody TicketStatusUpdateRequest request) {
        String userId = resolveUserId(principal);
        return ResponseEntity.ok(ticketService.updateTicketStatus(id, request, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTicket(
            @AuthenticationPrincipal Object principal,
            @PathVariable String id) {
        String userId = resolveUserId(principal);
        ticketService.deleteTicket(id, userId);
        return ResponseEntity.ok(Map.of("message", "Ticket deleted successfully"));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<TicketResponse> addComment(
            @AuthenticationPrincipal Object principal,
            @PathVariable String id,
            @Valid @RequestBody AddCommentRequest request) {
        String userId = resolveUserId(principal);
        String userName = resolveUserName(principal);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ticketService.addComment(id, request, userId, userName));
    }

    @PutMapping("/{id}/comments/{commentId}")
    public ResponseEntity<TicketResponse> editComment(
            @AuthenticationPrincipal Object principal,
            @PathVariable String id,
            @PathVariable String commentId,
            @Valid @RequestBody EditCommentRequest request) {
        String userId = resolveUserId(principal);
        return ResponseEntity.ok(ticketService.editComment(id, commentId, request, userId));
    }

    @DeleteMapping("/{id}/comments/{commentId}")
    public ResponseEntity<TicketResponse> deleteComment(
            @AuthenticationPrincipal Object principal,
            @PathVariable String id,
            @PathVariable String commentId) {
        String userId = resolveUserId(principal);
        return ResponseEntity.ok(ticketService.deleteComment(id, commentId, userId));
    }
}
