package com.wegroup423.smart_campus.features.ticket.service;

import com.wegroup423.smart_campus.features.ticket.model.dto.request.AddCommentRequest;
import com.wegroup423.smart_campus.features.ticket.model.dto.request.CreateTicketRequest;
import com.wegroup423.smart_campus.features.ticket.model.dto.request.EditCommentRequest;
import com.wegroup423.smart_campus.features.ticket.model.dto.request.UpdateTicketRequest;
import com.wegroup423.smart_campus.features.ticket.model.dto.response.TicketResponse;
import com.wegroup423.smart_campus.features.ticket.model.enums.Priority;
import com.wegroup423.smart_campus.features.ticket.model.enums.TicketStatus;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface TicketService {

    TicketResponse createTicket(CreateTicketRequest request, String currentUserId, String userName);

    List<TicketResponse> getTickets(String currentUserId, String role, TicketStatus status, Priority priority);

    TicketResponse getTicketById(String ticketId, String currentUserId, String role);

    TicketResponse updateTicket(String ticketId, UpdateTicketRequest request, String currentUserId, String role);

    void deleteTicket(String ticketId, String currentUserId, String role);

    TicketResponse addComment(String ticketId, AddCommentRequest request, String currentUserId, String userName);

    TicketResponse editComment(String ticketId, String commentId, EditCommentRequest request, String currentUserId);

    TicketResponse deleteComment(String ticketId, String commentId, String currentUserId, String role);

    TicketResponse uploadAttachments(String ticketId, List<MultipartFile> files, String currentUserId);
}
