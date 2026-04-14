package com.budgetmanager.backend.dao;

import com.budgetmanager.backend.model.PurchaseOrder;
import com.budgetmanager.backend.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

public class PurchaseOrderDAO {
    // Fetch all orders from the database
    public ArrayList<PurchaseOrder> getAllPurchaseOrders() {
        ArrayList<PurchaseOrder> purchaseOrders = new ArrayList<>();
        String query = """
                    SELECT 
                        po.purchase_order_id,
                        po.order_amount,
                        po.notes,
                
                        po.generated_order_code,
                        po.investment_plan_code,
                
                        po.order_date
                    FROM purchase_orders po
                    WHERE po.deleted_at IS NULL
                    ORDER BY po.order_date DESC
                """;

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                PurchaseOrder po = new PurchaseOrder(
                        rs.getInt("purchase_order_id"),
                        rs.getDouble("order_amount"),
                        rs.getString("notes"),
                        rs.getString("generated_order_code"),
                        rs.getString("investment_plan_code"),
                        false,
                        null,
                        rs.getDate("order_date").toLocalDate(),
                        null,
                        0,
                        0,
                        0,
                        null,
                        null,
                        null
                );
                purchaseOrders.add(po);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return purchaseOrders;
    }
}
