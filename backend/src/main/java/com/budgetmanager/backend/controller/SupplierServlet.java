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
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        ResponseUtil.setupJsonResponse(resp);

        User user = AuthUtil.getUser(req);
        if (user == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.getWriter().write(gson.toJson(Map.of("error", "Not authenticated")));
            return;
        }

        String departmentParam = req.getParameter("departmentId");
        String allParam = req.getParameter("all");
        boolean requestAll = "true".equalsIgnoreCase(allParam);

        ArrayList<Supplier> suppliers;

        if (requestAll) {
            suppliers = supplierDAO.getAllSuppliers();

        } else if (departmentParam != null && !departmentParam.isEmpty()) {
            try {
                int departmentId = Integer.parseInt(departmentParam);
                suppliers = supplierDAO.getSuppliersForUser(departmentId);
            } catch (NumberFormatException e) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write(gson.toJson(Map.of("error", "Invalid departmentId")));
                return;
            }

        } else {
            // Fall back to the authenticated user's own department
            Integer departmentId = user.getDepartmentId();
            if (departmentId == null) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write(gson.toJson(Map.of("error", "User has no department")));
                return;
            }
            suppliers = supplierDAO.getSuppliersForUser(departmentId);
        }

        resp.getWriter().write(gson.toJson(suppliers));
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        ResponseUtil.setupJsonResponse(response);

        String pathInfo = request.getPathInfo();
        if (pathInfo != null && pathInfo.equals("/assign")) {
            // Handle assign
            User user = AuthUtil.getUser(request);
            if (user == null || (!"admin".equalsIgnoreCase(user.getRoleName()) && !"jefe_departamento".equalsIgnoreCase(user.getRoleName()))) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.getWriter().write(gson.toJson(Map.of("error", "Not authorized")));
                return;
            }

            Map<String, Object> payload = gson.fromJson(request.getReader(), Map.class);
            Integer providerId = parseInteger(payload.get("providerId"));
            Integer departmentId = parseInteger(payload.get("departmentId"));

            if (providerId == null || departmentId == null) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write(gson.toJson(Map.of("error", "providerId and departmentId must be numeric")));
                return;
            }

            try {
                String result = supplierDAO.assignSupplierToDepartment(providerId, departmentId);
                if ("already_assigned".equals(result)) {
                    response.setStatus(HttpServletResponse.SC_CONFLICT); // 409 Conflict
                    response.getWriter().write(gson.toJson(Map.of("error", "Proveedor ya asignado a este departamento")));
                } else if ("assigned".equals(result)) {
                    response.setStatus(HttpServletResponse.SC_OK);
                    response.getWriter().write(gson.toJson(Map.of("success", true)));
                } else {
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    response.getWriter().write(gson.toJson(Map.of("error", "Error assigning supplier")));
                }
            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write(gson.toJson(Map.of("error", "Error assigning supplier")));
            }
            return;
        }

        // Handle create
        User user = AuthUtil.getUser(request);
        if (user == null || (!"admin".equalsIgnoreCase(user.getRoleName()) && !"jefe_departamento".equalsIgnoreCase(user.getRoleName()))) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write(gson.toJson(Map.of("error", "Not authorized")));
            return;
        }

		Map<String, Object> payload = gson.fromJson(request.getReader(), Map.class);
		String name = payload.getOrDefault("name", "").toString();
		String email = payload.getOrDefault("email", "").toString();
		String phone = payload.getOrDefault("phone", "").toString();
		String taxId = payload.getOrDefault("taxId", "").toString();
		String notes = payload.getOrDefault("notes", "").toString();
		boolean shared = Boolean.parseBoolean(payload.getOrDefault("shared", "false").toString());

		try {
			Supplier supplier = supplierDAO.createSupplier(
					new Supplier(name, email, phone, taxId, notes, shared)
			);

			if (supplier == null) {
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				response.getWriter().write(gson.toJson(Map.of("error", "Failed to create supplier")));
				return;
			}

			// If created by jefe_departamento and not shared, assign to their department
			if ("jefe_departamento".equalsIgnoreCase(user.getRoleName()) && !shared && user.getDepartmentId() != null) {
				supplierDAO.assignSupplierToDepartment(supplier.getSupplierId(), user.getDepartmentId());
			}

			response.setStatus(HttpServletResponse.SC_CREATED);
			response.getWriter().write(gson.toJson(supplier));
		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().write(gson.toJson(Map.of("error", "Error creating supplier")));
			e.printStackTrace();
		}
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
		if (user == null || ("contable".equalsIgnoreCase(user.getRoleName()))) {
			response.setStatus(HttpServletResponse.SC_FORBIDDEN);
			response.getWriter().write(gson.toJson(Map.of("error", "Not authorized")));
			return;
		}

        String idParam = request.getParameter("id");
        if (idParam == null || idParam.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(gson.toJson(Map.of("error", "ID required")));
            return;
        }

        try {
            int id = Integer.parseInt(idParam);
            supplierDAO.deleteSupplierById(id);
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(gson.toJson(Map.of("success", true)));

        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(gson.toJson(Map.of("error", "Invalid ID")));

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(gson.toJson(Map.of("error", "Error deleting supplier")));
        }
    }

    private Integer parseInteger(Object value) {
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
