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
import java.util.Map;

@WebServlet("/api/suppliers/*")
public class SupplierServlet extends HttpServlet {

    private final SupplierDAO supplierDAO = new SupplierDAO();
    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        ResponseUtil.setupJsonResponse(response);

        // Check the authenticated user
        User user = AuthUtil.getUser(request);
        if (user == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            ResponseUtil.sendJson(response, Map.of("error", "No has iniciado sesión"));
            return;
        }

        String departmentParam = request.getParameter("departmentId");
        String allParam = request.getParameter("all");
        boolean requestAll = "true".equalsIgnoreCase(allParam);

        ArrayList<Supplier> suppliers;

        // Get suppliers based on the requested filter
        if (requestAll) {
            suppliers = supplierDAO.getAllSuppliers();
        } else if (departmentParam != null && !departmentParam.isEmpty()) {
            try {
                int departmentId = Integer.parseInt(departmentParam);
                suppliers = supplierDAO.getSuppliersForUser(departmentId);
            } catch (NumberFormatException e) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                ResponseUtil.sendJson(response, Map.of("error", "El ID del departamento no es válido"));
                return;
            }
        } else {
            Integer departmentId = user.getDepartmentId();

            if (departmentId == null) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                ResponseUtil.sendJson(response, Map.of("error", "El usuario no tiene ningún departamento asignado"));
                return;
            }

            suppliers = supplierDAO.getSuppliersForUser(departmentId);
        }

        ResponseUtil.sendJson(response, suppliers);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        ResponseUtil.setupJsonResponse(response);

        String pathInfo = request.getPathInfo();

        if ("/assign".equals(pathInfo)) {
            handleAssignSupplier(request, response);
            return;
        }

        // Check if the user can create suppliers
        User user = AuthUtil.getUser(request);
        if (user == null || !canManageSuppliers(user)) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            ResponseUtil.sendJson(response, Map.of("error", "No tienes permisos para realizar esta acción"));
            return;
        }

        // Read supplier data from the request body
        Map<String, Object> payload = gson.fromJson(request.getReader(), Map.class);

        String name = payload.getOrDefault("name", "").toString();
        String email = payload.getOrDefault("email", "").toString();
        String phone = payload.getOrDefault("phone", "").toString();
        String taxId = payload.getOrDefault("taxId", "").toString();
        String notes = payload.getOrDefault("notes", "").toString();
        boolean shared = Boolean.parseBoolean(payload.getOrDefault("shared", "false").toString());

        try {
            // Create the supplier
            Supplier supplier = supplierDAO.createSupplier(
                    new Supplier(name, email, phone, taxId, notes, shared)
            );

            if (supplier == null) {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                ResponseUtil.sendJson(response, Map.of("error", "No se ha podido crear el proveedor"));
                return;
            }

            // Assign department suppliers automatically when needed
            if ("jefe_departamento".equalsIgnoreCase(user.getRoleName())
                    && !shared
                    && user.getDepartmentId() != null) {
                supplierDAO.assignSupplierToDepartment(supplier.getSupplierId(), user.getDepartmentId());
            }

            response.setStatus(HttpServletResponse.SC_CREATED);
            ResponseUtil.sendJson(response, supplier);
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            ResponseUtil.sendJson(response, Map.of("error", "Error al crear el proveedor"));
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        ResponseUtil.setupJsonResponse(response);

        // Check if the user can update suppliers
        User user = AuthUtil.getUser(request);
        if (user == null || "contable".equalsIgnoreCase(user.getRoleName())) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            ResponseUtil.sendJson(response, Map.of("error", "No tienes permisos para realizar esta acción"));
            return;
        }

        String idParam = request.getParameter("id");
        if (idParam == null || idParam.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            ResponseUtil.sendJson(response, Map.of("error", "El ID es obligatorio"));
            return;
        }

        // Read updated supplier data
        Map<String, Object> payload = gson.fromJson(request.getReader(), Map.class);

        String name = payload.getOrDefault("name", "").toString();
        String email = payload.getOrDefault("email", "").toString();
        String phone = payload.getOrDefault("phone", "").toString();
        String taxId = payload.getOrDefault("taxId", "").toString();
        String notes = payload.getOrDefault("notes", "").toString();

        try {
            // Update the supplier
            int id = Integer.parseInt(idParam);
            Supplier supplier = new Supplier(id, name, email, phone, taxId, notes, false, null, null);
            Supplier updatedSupplier = supplierDAO.updateSupplier(supplier);

            if (updatedSupplier == null) {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                ResponseUtil.sendJson(response, Map.of("error", "No se ha podido actualizar el proveedor"));
                return;
            }

            response.setStatus(HttpServletResponse.SC_OK);
            ResponseUtil.sendJson(response, updatedSupplier);
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            ResponseUtil.sendJson(response, Map.of("error", "El ID no es válido"));
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            ResponseUtil.sendJson(response, Map.of("error", "Error al actualizar el proveedor"));
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        ResponseUtil.setupJsonResponse(response);

        // Check if the user can delete suppliers
        User user = AuthUtil.getUser(request);
        if (user == null || "contable".equalsIgnoreCase(user.getRoleName())) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            ResponseUtil.sendJson(response, Map.of("error", "No tienes permisos para realizar esta acción"));
            return;
        }

        String idParam = request.getParameter("id");
        if (idParam == null || idParam.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            ResponseUtil.sendJson(response, Map.of("error", "El ID es obligatorio"));
            return;
        }

        try {
            // Delete the supplier
            int id = Integer.parseInt(idParam);
            supplierDAO.deleteSupplierById(id);

            response.setStatus(HttpServletResponse.SC_OK);
            ResponseUtil.sendJson(response, Map.of("success", true));
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            ResponseUtil.sendJson(response, Map.of("error", "El ID no es válido"));
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            ResponseUtil.sendJson(response, Map.of("error", "Error al eliminar el proveedor"));
        }
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        ResponseUtil.setupJsonResponse(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    private void handleAssignSupplier(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        // Check if the user can assign suppliers
        User user = AuthUtil.getUser(request);
        if (user == null || !canManageSuppliers(user)) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            ResponseUtil.sendJson(response, Map.of("error", "No tienes permisos para realizar esta acción"));
            return;
        }

        // Read assignment data from the request body
        Map<String, Object> payload = gson.fromJson(request.getReader(), Map.class);

        Integer providerId = parseInteger(payload.get("providerId"));
        Integer departmentId = parseInteger(payload.get("departmentId"));

        if (providerId == null || departmentId == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            ResponseUtil.sendJson(response, Map.of("error", "providerId and departmentId must be numeric"));
            return;
        }

        try {
            // Assign the supplier to the department
            String result = supplierDAO.assignSupplierToDepartment(providerId, departmentId);

            if ("already_assigned".equals(result)) {
                response.setStatus(HttpServletResponse.SC_CONFLICT);
                ResponseUtil.sendJson(response, Map.of("error", "Proveedor ya asignado a este departamento"));
            } else if ("assigned".equals(result)) {
                response.setStatus(HttpServletResponse.SC_OK);
                ResponseUtil.sendJson(response, Map.of("success", true));
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                ResponseUtil.sendJson(response, Map.of("error", "Error al asignar el proveedor"));
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            ResponseUtil.sendJson(response, Map.of("error", "Error al asignar el proveedor"));
        }
    }

    private boolean canManageSuppliers(User user) {
        String roleName = user.getRoleName();

        return "admin".equalsIgnoreCase(roleName)
                || "jefe_departamento".equalsIgnoreCase(roleName);
    }

    private Integer parseInteger(Object value) {
        // Convert numeric request values safely
        if (value instanceof Number) {
            return ((Number) value).intValue();
        }

        if (value instanceof String) {
            try {
                return Integer.parseInt((String) value);
            } catch (NumberFormatException ignored) {
            }
        }

        return null;
    }
}