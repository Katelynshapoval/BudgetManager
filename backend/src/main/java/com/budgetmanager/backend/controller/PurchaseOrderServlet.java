package com.budgetmanager.backend.controller;

import com.budgetmanager.backend.dao.InvoiceDAO;
import com.budgetmanager.backend.dao.PurchaseOrderDAO;
import com.budgetmanager.backend.model.Invoice;
import com.budgetmanager.backend.model.PurchaseOrder;
import com.budgetmanager.backend.model.User;
import com.budgetmanager.backend.util.AuthUtil;
import com.budgetmanager.backend.util.ResponseUtil;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;

@WebServlet("/api/purchase-orders/*")
public class PurchaseOrderServlet extends HttpServlet {

    private final PurchaseOrderDAO purchaseOrderDAO = new PurchaseOrderDAO();
    private final InvoiceDAO invoiceDAO = new InvoiceDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        ResponseUtil.setupJsonResponse(resp);

        // Check if the user is logged in
        User user = AuthUtil.getUser(req);

        if (user == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String path = req.getPathInfo();

        // Return the next preview code before creating the purchase order
        if ("/preview".equals(path)) {
            try {
                String departmentIdParam = req.getParameter("departmentId");
                String budgetTypeIdParam = req.getParameter("budgetTypeId");

                if (departmentIdParam == null || departmentIdParam.isEmpty()
                        || budgetTypeIdParam == null || budgetTypeIdParam.isEmpty()) {
                    resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    return;
                }

                int departmentId = Integer.parseInt(departmentIdParam);
                int budgetTypeId = Integer.parseInt(budgetTypeIdParam);
                boolean isFungible = Boolean.parseBoolean(req.getParameter("isFungible"));

                String code = purchaseOrderDAO.getNextOrderCodePreview(
                        departmentId,
                        budgetTypeId,
                        isFungible
                );

                if (code == null) {
                    resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    return;
                }

                resp.setStatus(HttpServletResponse.SC_OK);
                resp.getWriter().write("{\"code\": \"" + code + "\"}");
                return;

            } catch (NumberFormatException e) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                return;

            } catch (Exception e) {
                resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                e.printStackTrace();
                return;
            }
        }

        ArrayList<PurchaseOrder> purchaseOrders;
        String role = user.getRoleName();

        // Admins and accountants can see every purchase order
        if ("admin".equalsIgnoreCase(role) || "contable".equalsIgnoreCase(role)) {
            purchaseOrders = purchaseOrderDAO.getAllPurchaseOrders();
        } else {
            Integer departmentId = user.getDepartmentId();

            // Regular users must belong to a department
            if (departmentId == null) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                return;
            }

            purchaseOrders = purchaseOrderDAO.getPurchaseOrdersByDepartment(departmentId);
        }

        // Add invoices to each purchase order before sending the response
        for (PurchaseOrder purchaseOrder : purchaseOrders) {
            ArrayList<Invoice> invoices =
                    invoiceDAO.getInvoicesByPurchaseOrderId(
                            purchaseOrder.getPurchaseOrderId()
                    );

            purchaseOrder.setInvoices(invoices);
        }

        ResponseUtil.sendJson(resp, purchaseOrders);
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        ResponseUtil.setupJsonResponse(resp);

        // Check if the user is logged in
        User user = AuthUtil.getUser(req);

        if (user == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        // Only admins can delete purchase orders
        if (!"admin".equalsIgnoreCase(user.getRoleName())) {
            resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return;
        }

        String idParam = req.getParameter("id");

        if (idParam == null || idParam.isEmpty()) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        try {
            int orderId = Integer.parseInt(idParam);

            boolean deleted = purchaseOrderDAO.deletePurchaseOrderById(orderId);

            if (!deleted) {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                return;
            }

            resp.setStatus(HttpServletResponse.SC_OK);
            resp.getWriter().write("{\"success\": true}");

        } catch (NumberFormatException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);

        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            e.printStackTrace();
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        ResponseUtil.setupJsonResponse(resp);

        // Check if the user is logged in
        User user = AuthUtil.getUser(req);

        if (user == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.getWriter().write("{\"message\": \"No has iniciado sesión\"}");
            return;
        }

        try {
            // Read the JSON sent from the frontend
            Gson gson = new Gson();
            JsonObject body = gson.fromJson(req.getReader(), JsonObject.class);

            int supplierId = body.get("supplierId").getAsInt();
            int departmentId = body.get("departmentId").getAsInt();
            int budgetTypeId = body.get("budgetTypeId").getAsInt();
            double amount = body.get("quantity").getAsDouble();
            LocalDate orderDate = LocalDate.parse(body.get("orderDate").getAsString());
            String notes = body.get("description").getAsString();
            boolean isFungible = body.get("isFungible").getAsBoolean();

            // This is only used for investment plan orders
            String investmentCode = null;

            if (body.has("investmentCode") && !body.get("investmentCode").isJsonNull()) {
                String value = body.get("investmentCode").getAsString().trim();

                if (!value.isEmpty()) {
                    investmentCode = value;
                }
            }

            int purchaseOrderId = purchaseOrderDAO.createPurchaseOrder(
                    supplierId,
                    departmentId,
                    budgetTypeId,
                    amount,
                    orderDate,
                    notes,
                    isFungible,
                    investmentCode,
                    user.getUserId()
            );

            if (purchaseOrderId == 0) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("{\"message\": \"No se pudo crear la orden de compra\"}");
                return;
            }

            resp.setStatus(HttpServletResponse.SC_CREATED);
            resp.getWriter().write(
                    "{\"success\": true, \"purchaseOrderId\": " + purchaseOrderId + "}"
            );

        } catch (SQLException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);

            String message = e.getMessage();

            if (message == null || message.isBlank()) {
                message = "Error de base de datos al crear la orden de compra";
            }

            resp.getWriter().write(
                    "{\"message\": " + new Gson().toJson(message) + "}"
            );

            e.printStackTrace();

        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"message\": \"Error interno creando la orden de compra\"}");
            e.printStackTrace();
        }
    }
}