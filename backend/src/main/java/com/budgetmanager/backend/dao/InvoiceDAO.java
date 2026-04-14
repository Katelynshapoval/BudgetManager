package com.budgetmanager.backend.dao;

import com.budgetmanager.backend.model.Invoice;
import com.budgetmanager.backend.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

public class InvoiceDAO {

    // Fetch all invoices from the database
    public ArrayList<Invoice> getAllInvoices() {
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
                ORDER BY i.uploaded_at DESC
                """;

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) {

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
}