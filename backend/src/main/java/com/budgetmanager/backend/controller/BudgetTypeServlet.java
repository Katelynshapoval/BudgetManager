package com.budgetmanager.backend.controller;

import com.budgetmanager.backend.dao.BudgetTypeDAO;
import com.budgetmanager.backend.model.BudgetType;
import com.budgetmanager.backend.util.ResponseUtil;
import com.google.gson.Gson;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.util.ArrayList;

@WebServlet("/api/budget-types")
public class BudgetTypeServlet extends HttpServlet {

    private final BudgetTypeDAO budgetTypeDAO = new BudgetTypeDAO();
    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        ResponseUtil.setupJsonResponse(resp);

        ArrayList<BudgetType> types = budgetTypeDAO.getAllBudgetTypes();

        String json = gson.toJson(types);
        resp.getWriter().write(json);
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        ResponseUtil.setupJsonResponse(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }
}