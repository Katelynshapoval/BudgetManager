package com.budgetmanager.backend.controller;

import com.budgetmanager.backend.dao.UserDAO;
import com.budgetmanager.backend.util.AuthUtil;
import com.budgetmanager.backend.util.PasswordUtils;
import com.budgetmanager.backend.util.ResponseUtil;
import com.google.gson.Gson;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Map;

@WebServlet("/api/users/password")
public class UserPasswordServlet extends HttpServlet {

    private final UserDAO userDAO = new UserDAO();
    private final Gson gson = new Gson();

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
        ResponseUtil.setupJsonResponse(response);

        // Check admin access
        if (!AuthUtil.requireAdmin(request, response)) {
            return;
        }

        // Read password update data
        Map<String, Object> body = gson.fromJson(request.getReader(), Map.class);

        int userId = ((Double) body.get("userId")).intValue();
        String newPassword = (String) body.get("newPassword");

        // Hash and update the password
        String hashedPassword = PasswordUtils.hashPassword(newPassword);
        boolean updated = userDAO.updateUserPassword(userId, hashedPassword);

        if (updated) {
            ResponseUtil.sendJson(response, Map.of("message", "Contraseña actualizada correctamente"));
        } else {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            ResponseUtil.sendJson(response, Map.of("error", "No se ha podido actualizar la contraseña"));
        }
    }
}