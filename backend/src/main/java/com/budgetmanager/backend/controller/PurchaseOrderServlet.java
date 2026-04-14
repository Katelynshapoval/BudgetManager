package com.budgetmanager.backend.controller;

import com.budgetmanager.backend.dao.InvoiceDAO;
import com.budgetmanager.backend.dao.PurchaseOrderDAO;
import com.budgetmanager.backend.model.Invoice;
import com.budgetmanager.backend.model.PurchaseOrder;
import com.budgetmanager.backend.util.ResponseUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.ArrayList;

@WebServlet("/api/purchase-orders")
public class PurchaseOrderServlet extends HttpServlet {
    private PurchaseOrderDAO purchaseOrderDAO = new PurchaseOrderDAO();
    private InvoiceDAO invoiceDAO = new InvoiceDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        ArrayList<PurchaseOrder> purchaseOrders = purchaseOrderDAO.getAllPurchaseOrders();

        // Attach invoices to each purchase order
        for (PurchaseOrder po : purchaseOrders) {
            ArrayList<Invoice> invoices = invoiceDAO.getInvoicesByPurchaseOrderId(po.getPurchaseOrderId());
            po.setInvoices(invoices);
        }

        ResponseUtil.setupJsonResponse(resp);
        ResponseUtil.sendJson(resp, purchaseOrders);
    }
}
