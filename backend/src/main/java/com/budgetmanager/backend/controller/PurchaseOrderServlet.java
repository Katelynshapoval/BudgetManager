package com.budgetmanager.backend.controller;

import com.budgetmanager.backend.dao.InvoiceDAO;
import com.budgetmanager.backend.dao.PurchaseOrderDAO;
import com.budgetmanager.backend.model.Invoice;
import com.budgetmanager.backend.model.PurchaseOrder;
import com.budgetmanager.backend.model.User;
import com.budgetmanager.backend.util.AuthUtil;
import com.budgetmanager.backend.util.ResponseUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.util.ArrayList;

@WebServlet("/api/purchase-orders/*")
public class PurchaseOrderServlet extends HttpServlet {

    private final PurchaseOrderDAO purchaseOrderDAO = new PurchaseOrderDAO();
    private final InvoiceDAO invoiceDAO = new InvoiceDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {

        ResponseUtil.setupJsonResponse(resp);

        User user = AuthUtil.getUser(req);

        if (user == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.getWriter().write("{\"error\": \"Not authenticated\"}");
            return;
        }

        String path = req.getPathInfo();

        // PREVIEW ENDPOINT
        if (path != null && path.equals("/preview")) {
            handlePreview(req, resp);
            return;
        }

        // NORMAL FETCH ORDERS
        ArrayList<PurchaseOrder> purchaseOrders;

        String role = user.getRoleName();

        if ("admin".equalsIgnoreCase(role) || "contable".equalsIgnoreCase(role)) {
            purchaseOrders = purchaseOrderDAO.getAllPurchaseOrders();
        } else {
            Integer departmentId = user.getDepartmentId();

            if (departmentId == null) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("{\"error\": \"User has no department\"}");
                return;
            }

            purchaseOrders = purchaseOrderDAO.getPurchaseOrdersByDepartment(departmentId);
        }

        // Attach invoices
        for (PurchaseOrder po : purchaseOrders) {
            ArrayList<Invoice> invoices =
                    invoiceDAO.getInvoicesByPurchaseOrderId(po.getPurchaseOrderId());
            po.setInvoices(invoices);
        }

        ResponseUtil.sendJson(resp, purchaseOrders);
    }

    // =========================
    // PREVIEW HANDLER
    // =========================
    private void handlePreview(HttpServletRequest req, HttpServletResponse resp) throws IOException {

        try {
            int budgetId = Integer.parseInt(req.getParameter("budgetId"));
            boolean isFungible = Boolean.parseBoolean(req.getParameter("isFungible"));

            String code = purchaseOrderDAO.getNextOrderCodePreview(budgetId, isFungible);

            if (code == null) {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                resp.getWriter().write("{\"error\": \"No preview available\"}");
                return;
            }

            resp.setStatus(HttpServletResponse.SC_OK);
            resp.getWriter().write("{\"code\": \"" + code + "\"}");

        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"error\": \"Invalid parameters\"}");
        }
    }
}