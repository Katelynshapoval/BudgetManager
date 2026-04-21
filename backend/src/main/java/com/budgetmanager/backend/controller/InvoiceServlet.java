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

import java.io.IOException;

@MultipartConfig(
        fileSizeThreshold = 1024 * 1024,     // 1MB in memory, rest on disk
        maxFileSize = 10 * 1024 * 1024,      // max size per file (10MB)
        maxRequestSize = 20 * 1024 * 1024    // total request size (20MB)
)
@WebServlet("/api/invoices/file")
public class InvoiceServlet extends HttpServlet {
    private InvoiceDAO invoiceDAO = new InvoiceDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        int invoiceId = Integer.parseInt(req.getParameter("id"));

        Invoice invoice = invoiceDAO.getInvoiceById(invoiceId);

        ResponseUtil.setupJsonResponse(resp);
        resp.setContentType("application/pdf");
        resp.getOutputStream().write(invoice.getFile());
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        try {
            // Get form fields
            double amount = Double.parseDouble(req.getParameter("amount"));
            int purchaseOrderId = Integer.parseInt(req.getParameter("purchase_order_id"));

            // Get uploaded file
            var filePart = req.getPart("file");
            byte[] fileBytes = filePart.getInputStream().readAllBytes();

            // Create Invoice object
            Invoice invoice = new Invoice(
                    0,
                    fileBytes,
                    amount,
                    purchaseOrderId,
                    null,
                    null
            );

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

        ResponseUtil.setupJsonResponse(resp);
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) {
        ResponseUtil.setupJsonResponse(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
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

        ResponseUtil.setupJsonResponse(resp);
    }

}
