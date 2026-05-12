package com.budgetmanager.backend.controller;

import com.budgetmanager.backend.dao.UserDAO;
import com.budgetmanager.backend.model.User;
import com.budgetmanager.backend.util.AuthUtil;
import com.budgetmanager.backend.util.ResponseUtil;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet("/api/users")
public class UserServlet extends HttpServlet {

    private final UserDAO userDAO = new UserDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {

        ResponseUtil.setupJsonResponse(resp);

        // Check admin access
        if (!AuthUtil.requireAdmin(req, resp)) {
            return;
        }

        // Fetch users
        List<User> users = userDAO.getUsers();

        ResponseUtil.sendJson(resp, users);
    }
}