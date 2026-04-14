package com.wegroup423.smart_campus.features.ticket.controller;

import com.wegroup423.smart_campus.features.auth.repository.UserRepository;
import com.wegroup423.smart_campus.features.ticket.model.dto.request.AddCommentRequest;
import com.wegroup423.smart_campus.features.ticket.model.dto.request.CreateTicketRequest;
import com.wegroup423.smart_campus.features.ticket.model.dto.request.EditCommentRequest;
import com.wegroup423.smart_campus.features.ticket.model.dto.request.UpdateTicketRequest;
import com.wegroup423.smart_campus.features.ticket.model.dto.response.TicketResponse;
import com.wegroup423.smart_campus.features.ticket.model.enums.Priority;
import com.wegroup423.smart_campus.features.ticket.model.enums.TicketStatus;
import com.wegroup423.smart_campus.features.ticket.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;
    private final UserRepository userRepository;

    // POST /api/tickets — Create a new incident ticket
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TicketResponse> createTicket(
            @Valid @RequestBody CreateTicketRequest request,
            Authentication authentication
    ) {
        String userId = authentication.getName();
        String userName = resolveUserName(userId);
        TicketResponse response = ticketService.createTicket(request, userId, userName);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // GET /api/tickets — List tickets
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TicketResponse>> getTickets(
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) Priority priority,
            Authentication authentication
    ) {
        String userId = authentication.getName();
        String role = resolveRole(authentication);
        List<TicketResponse> tickets = ticketService.getTickets(userId, role, status, priority);
        return ResponseEntity.ok(tickets);
    }

    // GET /api/tickets/{id} — Get ticket with comments and attachments
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TicketResponse> getTicketById(
            @PathVariable String id,
            Authentication authentication
    ) {
        String userId = authentication.getName();
        String role = resolveRole(authentication);
        return ResponseEntity.ok(ticketService.getTicketById(id, userId, role));
    }

    // PUT /api/tickets/{id} — Update ticket status / assign technician (Admin / Technician)
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<TicketResponse> updateTicket(
            @PathVariable String id,
            @RequestBody UpdateTicketRequest request,
            Authentication authentication
    ) {
        String userId = authentication.getName();
        String role = resolveRole(authentication);
        return ResponseEntity.ok(ticketService.updateTicket(id, request, userId, role));
    }

    // DELETE /api/tickets/{id} — Admin reject/close ticket
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteTicket(
            @PathVariable String id,
            Authentication authentication
    ) {
        String userId = authentication.getName();
        String role = resolveRole(authentication);
        ticketService.deleteTicket(id, userId, role);
        return ResponseEntity.noContent().build();
    }

    // POST /api/tickets/{id}/comments — Add a comment
    @PostMapping("/{id}/comments")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TicketResponse> addComment(
            @PathVariable String id,
            @Valid @RequestBody AddCommentRequest request,
            Authentication authentication
    ) {
        String userId = authentication.getName();
        String userName = resolveUserName(userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ticketService.addComment(id, request, userId, userName));
    }

    // PUT /api/tickets/{id}/comments/{cid} — Edit own comment
    @PutMapping("/{id}/comments/{cid}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TicketResponse> editComment(
            @PathVariable String id,
            @PathVariable String cid,
            @Valid @RequestBody EditCommentRequest request,
            Authentication authentication
    ) {
        String userId = authentication.getName();
        return ResponseEntity.ok(ticketService.editComment(id, cid, request, userId));
    }

    // DELETE /api/tickets/{id}/comments/{cid} — Delete own comment (or admin)
    @DeleteMapping("/{id}/comments/{cid}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TicketResponse> deleteComment(
            @PathVariable String id,
            @PathVariable String cid,
            Authentication authentication
    ) {
        String userId = authentication.getName();
        String role = resolveRole(authentication);
        return ResponseEntity.ok(ticketService.deleteComment(id, cid, userId, role));
    }

    // POST /api/tickets/{id}/attachments — Upload images (max 3)
    @PostMapping(value = "/{id}/attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TicketResponse> uploadAttachments(
            @PathVariable String id,
            @RequestParam("files") List<MultipartFile> files,
            Authentication authentication
    ) {
        String userId = authentication.getName();
        return ResponseEntity.ok(ticketService.uploadAttachments(id, files, userId));
    }

    // GET /api/tickets/{id}/attachments/{filename} — Serve uploaded file
    @GetMapping("/{id}/attachments/{filename}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Resource> serveAttachment(
            @PathVariable String id,
            @PathVariable String filename
    ) {
        try {
            Path filePath = Paths.get("uploads", "tickets", id, filename);
            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(resource);
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // ─── helpers ─────────────────────────────────────────────────────────────

    private String resolveRole(Authentication auth) {
        return auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(a -> a.startsWith("ROLE_"))
                .map(a -> a.substring(5))
                .findFirst()
                .orElse("USER");
    }

    private String resolveUserName(String userId) {
        return userRepository.findById(userId)
                .map(u -> u.getName() != null ? u.getName() : u.getEmail())
                .orElse("Unknown");
    }
}
