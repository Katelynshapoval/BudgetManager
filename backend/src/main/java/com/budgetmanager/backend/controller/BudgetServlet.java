package com.budgetmanager.backend.controller;

import com.budgetmanager.backend.dao.BudgetDAO;
import com.budgetmanager.backend.model.BudgetOverview;
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
import java.util.Map;

@WebServlet("/api/budgets/*")
public class BudgetServlet extends HttpServlet {

    private final BudgetDAO budgetDAO = new BudgetDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        String yearParam = req.getParameter("year");
        String type = req.getParameter("type");

        int year;
        try {
            year = Integer.parseInt(yearParam);
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        ArrayList<BudgetOverview> data = budgetDAO.getBudgetOverview(year, type);

        ResponseUtil.setupJsonResponse(resp);
        ResponseUtil.sendJson(resp, data);
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        ResponseUtil.setupJsonResponse(resp);

        User user = AuthUtil.getUser(req);
        if (user == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.getWriter().write("{\"error\": \"Not authenticated\"}");
            return;
        }

        // Only admin and jefe_departamento can update budgets
        if (!"admin".equalsIgnoreCase(user.getRoleName()) &&
            !"jefe_departamento".equalsIgnoreCase(user.getRoleName())) {
            resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
            resp.getWriter().write("{\"error\": \"Not authorized\"}");
            return;
        }

        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.equals("/")) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"error\": \"Budget ID required\"}");
            return;
        }

        String budgetIdStr = pathInfo.substring(1); // Remove leading "/"
        int budgetId;
        try {
            budgetId = Integer.parseInt(budgetIdStr);
        } catch (NumberFormatException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"error\": \"Invalid budget ID\"}");
            return;
        }

        try {
            Gson gson = new Gson();
            Map<String, Object> payload = gson.fromJson(req.getReader(), Map.class);

            if (!payload.containsKey("allocated")) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("{\"error\": \"Allocated amount required\"}");
                return;
            }

            double allocated = Double.parseDouble(payload.get("allocated").toString());

            BudgetOverview updated = budgetDAO.updateBudgetAllocated(budgetId, allocated);
            if (updated == null) {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                resp.getWriter().write("{\"error\": \"Budget not found\"}");
                return;
            }

            resp.setStatus(HttpServletResponse.SC_OK);
            ResponseUtil.sendJson(resp, updated);

        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"error\": \"Error updating budget\"}");
            e.printStackTrace();
        }
    }
}
