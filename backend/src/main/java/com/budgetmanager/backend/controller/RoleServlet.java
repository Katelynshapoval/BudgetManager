package com.budgetmanager.backend.controller;

import com.budgetmanager.backend.dao.RoleDAO;
import com.budgetmanager.backend.model.Role;
import com.google.gson.Gson;
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
    Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // Get data from the DB
        ArrayList<Role> roles = roleDAO.getAllRoles();

        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.setHeader("Access-Control-Allow-Origin", "*");
        String json = gson.toJson(roles);

        // Send response
        resp.getWriter().write(json);

    }
}
