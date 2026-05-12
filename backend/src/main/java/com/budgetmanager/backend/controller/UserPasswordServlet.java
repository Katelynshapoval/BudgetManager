package com.budgetmanager.backend.controller;

import com.budgetmanager.backend.dao.UserDAO;
import com.budgetmanager.backend.model.User;
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
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {

        ResponseUtil.setupJsonResponse(resp);

        // Check admin access
        if (!AuthUtil.requireAdmin(req, resp)) {
            return;
        }

        Map<String, Object> body = gson.fromJson(req.getReader(), Map.class);

        int userId = ((Double) body.get("userId")).intValue();
        String newPassword = (String) body.get("newPassword");

        String hashed = PasswordUtils.hashPassword(newPassword);

        boolean updated = userDAO.updateUserPassword(userId, hashed);

        if (updated) {
            ResponseUtil.sendJson(resp, Map.of("message", "Password updated"));
        } else {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}