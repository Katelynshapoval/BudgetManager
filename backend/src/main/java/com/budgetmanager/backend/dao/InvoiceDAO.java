package com.budgetmanager.backend.dao;

import com.budgetmanager.backend.model.Invoice;
import com.budgetmanager.backend.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

public class InvoiceDAO {

    // Get an invoice for a certain purchase order
    public ArrayList<Invoice> getInvoicesByPurchaseOrderId(int purchaseOrderId) {
        ArrayList<Invoice> invoices = new ArrayList<>();

        String query = """
                SELECT 
                    i.invoice_id,
                    i.file,
                    i.amount,
                    i.purchase_order_id,
                    i.uploaded_at,
                    i.deleted_at
                FROM invoices i
                WHERE i.deleted_at IS NULL
                  AND i.purchase_order_id = ?
                """;

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, purchaseOrderId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                Invoice invoice = new Invoice(
                        rs.getInt("invoice_id"),
                        rs.getBytes("file"),
                        rs.getDouble("amount"),
                        rs.getInt("purchase_order_id"),
                        rs.getTimestamp("uploaded_at") != null
                                ? rs.getTimestamp("uploaded_at").toLocalDateTime()
                                : null,
                        rs.getTimestamp("deleted_at") != null
                                ? rs.getTimestamp("deleted_at").toLocalDateTime()
                                : null
                );

                invoices.add(invoice);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return invoices;
    }

    // Get one invoice by id, for displaying the files
    public Invoice getInvoiceById(int invoiceId) {
        String query = """
                SELECT 
                    i.invoice_id,
                    i.file,
                    i.amount,
                    i.purchase_order_id,
                    i.uploaded_at,
                    i.deleted_at
                FROM invoices i
                WHERE i.invoice_id = ?
                  AND i.deleted_at IS NULL
                """;

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, invoiceId);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return new Invoice(
                        rs.getInt("invoice_id"),
                        rs.getBytes("file"),
                        rs.getDouble("amount"),
                        rs.getInt("purchase_order_id"),
                        rs.getTimestamp("uploaded_at") != null
                                ? rs.getTimestamp("uploaded_at").toLocalDateTime()
                                : null,
                        rs.getTimestamp("deleted_at") != null
                                ? rs.getTimestamp("deleted_at").toLocalDateTime()
                                : null
                );
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return null;
    }
}