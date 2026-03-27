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

import java.io.IOException;
import java.util.HashMap;

@WebServlet("/api/signup")
public class SignupServlet extends HttpServlet {
    private final UserDAO userDAO = new UserDAO();
    private final Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        ResponseUtil.setupJsonResponse(resp);

        HashMap<String, Object> responseMap = new HashMap<>();
        // Read parameters
        String username = req.getParameter("username");
        String name = req.getParameter("name");
        String password = req.getParameter("password");
        String passwordConf = req.getParameter("passwordConf");
        String departmentIdStr = req.getParameter("departmentId");
        String roleIdStr = req.getParameter("roleId");

        // Validate
        if (username == null || name == null || password == null || passwordConf == null) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            responseMap.put("error", "Missing required fields");
            resp.getWriter().write(gson.toJson(responseMap));
            return;
        }

        if (!password.equals(passwordConf)) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            responseMap.put("error", "Passwords do not match");
            resp.getWriter().write(gson.toJson(responseMap));
            return;
        }
        Integer departmentId = null;
        if (departmentIdStr != null && !departmentIdStr.isEmpty()) {
            departmentId = Integer.parseInt(departmentIdStr);
        }

        int roleId = Integer.parseInt(roleIdStr);

        // Hash password
        String hashedPassword = PasswordUtils.hashPassword(password);

        // Create User object
        User newUser = new User(username, name, hashedPassword, roleId, departmentId);

        // Insert into DB
        boolean created = userDAO.createUser(newUser);

        if (created) {
            resp.setStatus(HttpServletResponse.SC_OK);
            responseMap.put("message", "User created successfully");
        } else {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            responseMap.put("error", "Failed to create user");
        }

        ResponseUtil.sendJson(resp, responseMap);
    }
}
