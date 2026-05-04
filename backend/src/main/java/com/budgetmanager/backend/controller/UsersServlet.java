package com.budgetmanager.backend.controller;

import com.budgetmanager.backend.dao.UserDAO;
import com.budgetmanager.backend.model.User;
import com.budgetmanager.backend.util.AuthUtil;
import com.budgetmanager.backend.util.ResponseUtil;
import com.google.gson.Gson;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet("/api/users")
public class UsersServlet extends HttpServlet {

    private final UserDAO userDAO = new UserDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {

        ResponseUtil.setupJsonResponse(resp);

        User currentUser = AuthUtil.getUser(req);

        // Check authentication
        if (currentUser == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        // Check role (ONLY ADMIN)
        if (!"admin".equals(currentUser.getRoleName())) {
            resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return;
        }

        // Fetch users
        List<User> users = userDAO.getUsers();

        ResponseUtil.sendJson(resp, users);
    }
}