package com.budgetmanager.backend.controller;

import com.budgetmanager.backend.dao.RoleDAO;
import com.budgetmanager.backend.model.Role;
import com.budgetmanager.backend.util.ResponseUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.ArrayList;

@WebServlet("/api/roles")
public class RoleServlet extends HttpServlet {
    RoleDAO roleDAO = new RoleDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        ArrayList<Role> roles = roleDAO.getAllRoles();

        ResponseUtil.setupJsonResponse(resp);
        ResponseUtil.sendJson(resp, roles);
    }
}
