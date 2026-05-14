package com.budgetmanager.backend.controller;

import com.budgetmanager.backend.dao.BudgetDAO;
import com.budgetmanager.backend.model.BudgetOverview;
import com.budgetmanager.backend.model.Department;
import com.budgetmanager.backend.model.User;
import com.budgetmanager.backend.util.AuthUtil;
import com.budgetmanager.backend.util.ResponseUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;

import com.google.gson.Gson;

@WebServlet("/api/budgets/*")
public class BudgetServlet extends HttpServlet {

    private final BudgetDAO budgetDAO = new BudgetDAO();
    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        // Get the filters sent from the frontend
        String yearParam = req.getParameter("year");
        String type = req.getParameter("type");
        String available = req.getParameter("available");

        // Validate and convert the fiscal year
        int year;
        try {
            year = Integer.parseInt(yearParam);
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        // Prepare the response as JSON
        ResponseUtil.setupJsonResponse(resp);

        // Return only departments that do not already have a budget for this year and type
        if ("true".equalsIgnoreCase(available)) {
            ArrayList<Department> departments = budgetDAO.getAvailableDepartments(year, type);
            ResponseUtil.sendJson(resp, departments);
            return;
        }

        // Return the budget overview for the selected year and type
        ArrayList<BudgetOverview> data = budgetDAO.getBudgetOverview(year, type);
        ResponseUtil.sendJson(resp, data);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        // Prepare the response as JSON
        ResponseUtil.setupJsonResponse(resp);

        // Check that the user is logged in
        User user = AuthUtil.getUser(req);
        if (user == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.getWriter().write("{\"error\": \"No has iniciado sesión\"}");
            return;
        }

        // Allow only admins and department managers to create budgets
        if (!"admin".equalsIgnoreCase(user.getRoleName()) &&
                !"jefe_departamento".equalsIgnoreCase(user.getRoleName())) {
            resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
            resp.getWriter().write("{\"error\": \"No tienes permisos para realizar esta acción\"}");
            return;
        }

        try {
            // Read the request body sent from the frontend
            Map<String, Object> payload = gson.fromJson(req.getReader(), Map.class);

            // Check that all required fields are present
            if (!payload.containsKey("allocated") ||
                    !payload.containsKey("departmentId") ||
                    !payload.containsKey("year") ||
                    !payload.containsKey("type")) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("{\"error\": \"Faltan datos obligatorios\"}");
                return;
            }

            // Convert the request values to the correct types
            double allocated = ((Number) payload.get("allocated")).doubleValue();
            int departmentId = ((Number) payload.get("departmentId")).intValue();
            int fiscalYear = ((Number) payload.get("year")).intValue();
            String type = payload.get("type").toString();

            // Prevent creating another budget for the same department, year, and type
            if (budgetDAO.departmentHasBudget(departmentId, fiscalYear, type)) {
                resp.setStatus(HttpServletResponse.SC_CONFLICT);
                resp.getWriter().write("{\"error\": \"Ya existe un presupuesto para este departamento y año\"}");
                return;
            }

            // Get the database id for the selected budget type
            Integer budgetTypeId = budgetDAO.getBudgetTypeId(type);
            if (budgetTypeId == null) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("{\"error\": \"El tipo de presupuesto no es válid\"}");
                return;
            }

            // Create the budget in the database
            BudgetOverview created = budgetDAO.createBudget(allocated, fiscalYear, departmentId, budgetTypeId);
            if (created == null) {
                resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                resp.getWriter().write("{\"error\": \"No se ha podido crear el presupuesto\"}");
                return;
            }

            // Return the created budget
            resp.setStatus(HttpServletResponse.SC_CREATED);
            ResponseUtil.sendJson(resp, created);

        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"error\": \"Error al crear el presupuesto\"}");
            e.printStackTrace();
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        // Prepare the response as JSON
        ResponseUtil.setupJsonResponse(resp);

        // Check that the user is logged in
        User user = AuthUtil.getUser(req);
        if (user == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.getWriter().write("{\"error\": \"No has iniciado sesión\"}");
            return;
        }

        // Allow only admins and department managers to update budgets
        if (!"admin".equalsIgnoreCase(user.getRoleName()) &&
                !"jefe_departamento".equalsIgnoreCase(user.getRoleName())) {
            resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
            resp.getWriter().write("{\"error\": \"No has iniciado sesión\"}");
            return;
        }

        // Get the budget id from the request path
        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.equals("/")) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"error\": \"No has iniciado sesión\"}");
            return;
        }

        // Remove the leading slash from the path
        String budgetIdStr = pathInfo.substring(1);

        // Validate and convert the budget id
        int budgetId;
        try {
            budgetId = Integer.parseInt(budgetIdStr);
        } catch (NumberFormatException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"error\": \"No has iniciado sesión\"}");
            return;
        }

        try {
            // Read the request body sent from the frontend
            Map<String, Object> payload = gson.fromJson(req.getReader(), Map.class);

            // Check that the allocated amount was sent
            if (!payload.containsKey("allocated")) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("{\"error\": \"No has iniciado sesión\"}");
                return;
            }

            // Convert the allocated amount to a number
            double allocated = Double.parseDouble(payload.get("allocated").toString());

            // Update the allocated amount in the database
            BudgetOverview updated = budgetDAO.updateBudgetAllocated(budgetId, allocated);
            if (updated == null) {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                resp.getWriter().write("{\"error\": \"Presupuesto no encontrado\"}");
                return;
            }

            // Return the updated budget
            resp.setStatus(HttpServletResponse.SC_OK);
            ResponseUtil.sendJson(resp, updated);

        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"error\": \"Error al actualizar el presupuesto\"}");
            e.printStackTrace();
        }
    }
}