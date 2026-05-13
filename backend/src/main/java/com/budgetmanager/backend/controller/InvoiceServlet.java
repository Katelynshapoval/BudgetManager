package com.budgetmanager.backend.controller;

import com.budgetmanager.backend.dao.InvoiceDAO;
import com.budgetmanager.backend.model.Invoice;
import com.budgetmanager.backend.util.ResponseUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;

import java.io.IOException;

@MultipartConfig(
        fileSizeThreshold = 1024 * 1024,
        maxFileSize = 10 * 1024 * 1024,
        maxRequestSize = 20 * 1024 * 1024
)
@WebServlet("/api/invoices/file")
public class InvoiceServlet extends HttpServlet {

    private final InvoiceDAO invoiceDAO = new InvoiceDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        ResponseUtil.setupFileResponse(resp, "application/pdf");

        int invoiceId = Integer.parseInt(req.getParameter("id"));
        Invoice invoice = invoiceDAO.getInvoiceById(invoiceId);

        if (invoice == null) {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            resp.getWriter().write("Invoice not found");
            return;
        }

        resp.getOutputStream().write(invoice.getFile());
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        ResponseUtil.setupJsonResponse(resp);

        try {
            // Read multipart form fields
            Part amountPart = req.getPart("amount");
            Part purchaseOrderIdPart = req.getPart("purchase_order_id");
            Part filePart = req.getPart("file");

            // Validate required fields
            if (amountPart == null || purchaseOrderIdPart == null || filePart == null) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("Missing invoice data");
                return;
            }

            // Convert text fields
            String amountText = new String(amountPart.getInputStream().readAllBytes()).trim();
            String purchaseOrderIdText = new String(purchaseOrderIdPart.getInputStream().readAllBytes()).trim();

            double amount = Double.parseDouble(amountText);
            int purchaseOrderId = Integer.parseInt(purchaseOrderIdText);

            // Read uploaded file
            byte[] fileBytes = filePart.getInputStream().readAllBytes();

            Invoice invoice = new Invoice(0, fileBytes, amount, purchaseOrderId, null, null);
            boolean success = invoiceDAO.addInvoice(invoice);

            if (success) {
                resp.setStatus(HttpServletResponse.SC_CREATED);
                resp.getWriter().write("Invoice uploaded successfully");
            } else {
                resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                resp.getWriter().write("Failed to upload invoice");
            }

        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("Invalid request");
        }
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) {
        ResponseUtil.setupJsonResponse(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        ResponseUtil.setupJsonResponse(resp);

        try {
            int invoiceId = Integer.parseInt(req.getParameter("id"));
            Invoice invoice = invoiceDAO.getInvoiceById(invoiceId);

            if (invoice == null) {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                resp.getWriter().write("Invoice not found");
                return;
            }

            boolean success = invoiceDAO.deleteInvoice(invoice);

            if (success) {
                resp.setStatus(HttpServletResponse.SC_OK);
                resp.getWriter().write("Invoice deleted successfully");
            } else {
                resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                resp.getWriter().write("Failed to delete invoice");
            }

        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("Invalid request");
        }
    }
}
