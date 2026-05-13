package com.budgetmanager.backend.controller;

import com.budgetmanager.backend.dao.BudgetTypeDAO;
import com.budgetmanager.backend.model.BudgetType;
import com.budgetmanager.backend.util.ResponseUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.util.ArrayList;

@WebServlet("/api/budget-types")
public class BudgetTypeServlet extends HttpServlet {

    private final BudgetTypeDAO budgetTypeDAO = new BudgetTypeDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        ResponseUtil.setupJsonResponse(response);

        // Get all budget types
        ArrayList<BudgetType> types = budgetTypeDAO.getAllBudgetTypes();

        ResponseUtil.sendJson(response, types);
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        ResponseUtil.setupJsonResponse(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }
}