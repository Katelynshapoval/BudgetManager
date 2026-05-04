package com.budgetmanager.backend.controller;

import com.budgetmanager.backend.dao.UserDAO;
import com.budgetmanager.backend.model.User;
import com.budgetmanager.backend.util.PasswordUtils;
import com.budgetmanager.backend.util.ResponseUtil;
import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.HashMap;

@WebServlet("/api/login")
public class LoginServlet extends HttpServlet {
    private final UserDAO userDAO = new UserDAO();
    private final Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        ResponseUtil.setupJsonResponse(resp);

        // Get username and password from login form
        String username = req.getParameter("username");
        String password = req.getParameter("password");

        HashMap<String, Object> responseMap = new HashMap<>();

        if (username == null || password == null) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            responseMap.put("error", "Missing username or password");
            ResponseUtil.sendJson(resp, responseMap);
            return;
        }

        // Fetch user from DB
        User user = userDAO.getUserByUsername(username);
        if (user == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            responseMap.put("error", "User not found");
            ResponseUtil.sendJson(resp, responseMap);
            return;
        }

        // Make sure the status is active
        if (!"active".equals(user.getStatus())) {
            resp.setStatus(HttpServletResponse.SC_FORBIDDEN);

            if ("pending".equals(user.getStatus())) {
                responseMap.put("error", "Tu cuenta está pendiente de aprobación");
            } else if ("inactive".equals(user.getStatus())) {
                responseMap.put("error", "Tu cuenta está desactivada");
            } else {
                responseMap.put("error", "Acceso no permitido");
            }

            ResponseUtil.sendJson(resp, responseMap);
            return;
        }

        // Verify password
        boolean passwordValid = PasswordUtils.verifyPassword(password, user.getPasswordHash());

        if (passwordValid) {
            // Remove sensitive data before storing
            user.setPasswordHash(null);

            HttpSession session = req.getSession(true);
            session.setAttribute("user", user);
            resp.setStatus(HttpServletResponse.SC_OK);

            // User Data
            HashMap<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getUserId());
            userMap.put("name", user.getName());
            userMap.put("roleId", user.getRoleId());
            userMap.put("departmentId", user.getDepartmentId());
            userMap.put("roleName", user.getRoleName());

            responseMap.put("message", "Login successful");
            responseMap.put("user", userMap);
        } else {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            responseMap.put("error", "Invalid password");
        }
        ResponseUtil.sendJson(resp, responseMap);
    }
}
