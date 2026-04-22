package com.budgetmanager.backend.controller;

import com.budgetmanager.backend.dao.SupplierDAO;
import com.budgetmanager.backend.model.Supplier;
import com.budgetmanager.backend.model.User;
import com.budgetmanager.backend.util.AuthUtil;
import com.budgetmanager.backend.util.ResponseUtil;
import com.google.gson.Gson;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.util.ArrayList;

@WebServlet("/api/suppliers")
public class SupplierServlet extends HttpServlet {

    private final SupplierDAO supplierDAO = new SupplierDAO();
    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {

        ResponseUtil.setupJsonResponse(resp);

        User user = AuthUtil.getUser(req);

        if (user == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.getWriter().write("{\"error\": \"Not authenticated\"}");
            return;
        }

        ArrayList<Supplier> suppliers;

        String departmentParam = req.getParameter("departmentId");
        String allParam = req.getParameter("all");
        boolean requestAll = "true".equalsIgnoreCase(allParam);

        // 🔥 PRIORITY: if ?all=true → ALWAYS return all
        if (requestAll) {
            suppliers = supplierDAO.getAllSuppliers();

        } else if (departmentParam != null && !departmentParam.isEmpty()) {
            try {
                int departmentId = Integer.parseInt(departmentParam);
                suppliers = supplierDAO.getSuppliersForUser(departmentId);
            } catch (NumberFormatException e) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("{\"error\": \"Invalid departmentId\"}");
                return;
            }

        } else {
            // default → user department
            Integer departmentId = user.getDepartmentId();

            if (departmentId == null) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("{\"error\": \"User has no department\"}");
                return;
            }

            suppliers = supplierDAO.getSuppliersForUser(departmentId);
        }

        String json = gson.toJson(suppliers);
        resp.getWriter().write(json);
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        ResponseUtil.setupJsonResponse(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        ResponseUtil.setupJsonResponse(response);

        User user = AuthUtil.getUser(request);

        if (user == null || !"admin".equalsIgnoreCase(user.getRoleName())) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("{\"error\": \"Not authorized\"}");
            return;
        }

        String idParam = request.getParameter("id");

        if (idParam != null && !idParam.isEmpty()) {
            try {
                int id = Integer.parseInt(idParam);

                supplierDAO.delete(id);

                response.setStatus(HttpServletResponse.SC_OK);
                response.getWriter().write("{\"success\": true}");

            } catch (NumberFormatException e) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"error\": \"Invalid ID\"}");

            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write("{\"error\": \"Error deleting supplier\"}");
            }

        } else {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"ID required\"}");
        }
    }
}