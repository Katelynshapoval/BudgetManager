package com.budgetmanager.backend.controller;

import com.budgetmanager.backend.dao.DepartmentDAO;
import com.budgetmanager.backend.model.Department;
import com.budgetmanager.backend.util.ResponseUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.ArrayList;

@WebServlet("/api/departments")
public class DepartmentServlet extends HttpServlet {

    private final DepartmentDAO departmentDAO = new DepartmentDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        // Get data from the DB
        ArrayList<Department> departments = departmentDAO.getAllDepartments();

        ResponseUtil.setupJsonResponse(resp);
        ResponseUtil.sendJson(resp, departments);
    }
}
