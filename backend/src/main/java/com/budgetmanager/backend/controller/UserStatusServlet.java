package com.budgetmanager.backend.controller;

import com.budgetmanager.backend.dao.UserDAO;
import com.budgetmanager.backend.util.AuthUtil;
import com.budgetmanager.backend.util.ResponseUtil;
import com.google.gson.Gson;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Map;

@WebServlet("/api/users/status")
public class UserStatusServlet extends HttpServlet {

    private final UserDAO userDAO = new UserDAO();
    private final Gson gson = new Gson();

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
        ResponseUtil.setupJsonResponse(response);

        // Check admin access
        if (!AuthUtil.requireAdmin(request, response)) {
            return;
        }

        // Read status update data
        Map<String, Object> body = gson.fromJson(request.getReader(), Map.class);

        int userId = ((Double) body.get("userId")).intValue();
        String status = (String) body.get("status");

        // Update the user status
        boolean updated = userDAO.updateUserStatus(userId, status);

        if (updated) {
            ResponseUtil.sendJson(response, Map.of("message", "Estado actualizado correctamente"));
        } else {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            ResponseUtil.sendJson(response, Map.of("error", "No se ha podido actualizar el estado"));
        }
    }
}