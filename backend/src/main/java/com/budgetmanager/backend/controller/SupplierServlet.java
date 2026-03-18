package com.budgetmanager.backend.controller;

import com.budgetmanager.backend.dao.SupplierDAO;
import com.budgetmanager.backend.model.Supplier;
import com.google.gson.Gson;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.util.ArrayList;

// API endpoint for suppliers
@WebServlet("/api/suppliers")
public class SupplierServlet extends HttpServlet {

    private final SupplierDAO supplierDAO = new SupplierDAO();
    private final Gson gson = new Gson(); // JSON converter

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {

        // Get data from DB
        ArrayList<Supplier> suppliers = supplierDAO.getAllSuppliers();

        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        String json = gson.toJson(suppliers);

        // Send response
        resp.getWriter().write(json);
    }
}