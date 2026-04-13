package com.budgetmanager.backend.controller;

import com.budgetmanager.backend.dao.BudgetDAO;
import com.budgetmanager.backend.model.BudgetOverview;
import com.budgetmanager.backend.util.ResponseUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.ArrayList;

@WebServlet("/api/budgets")
public class BudgetServlet extends HttpServlet {

    private BudgetDAO budgetDAO = new BudgetDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        // Get query params
        String yearParam = req.getParameter("year");
        String type = req.getParameter("type"); // "presupuesto" or "plan de inversiones"

        int year;

        // Validate the year
        try {
            year = Integer.parseInt(yearParam);
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        // Get data from the DB
        ArrayList<BudgetOverview> data =
                budgetDAO.getBudgetOverview(year, type);

        ResponseUtil.setupJsonResponse(resp);
        ResponseUtil.sendJson(resp, data);
    }
}