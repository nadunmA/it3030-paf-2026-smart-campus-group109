package com.wegroup423.smart_campus.features.ticket.service;

import com.wegroup423.smart_campus.features.ticket.model.dto.request.*;
import com.wegroup423.smart_campus.features.ticket.model.dto.response.TicketResponse;

import java.util.List;

public interface TicketService {

    TicketResponse createTicket(CreateTicketRequest request, String userId, String userName);

    List<TicketResponse> getAllTickets();

    List<TicketResponse> getMyTickets(String userId);

    List<TicketResponse> getAssignedTickets(String technicianId);

    TicketResponse getTicketById(String id);

    TicketResponse updateTicket(String id, UpdateTicketRequest request, String userId);

    TicketResponse updateTicketStatus(String id, TicketStatusUpdateRequest request, String userId);

    void deleteTicket(String id, String userId);

    TicketResponse addComment(String ticketId, AddCommentRequest request, String userId, String userName);

    TicketResponse editComment(String ticketId, String commentId, EditCommentRequest request, String userId);

    TicketResponse deleteComment(String ticketId, String commentId, String userId);
}
