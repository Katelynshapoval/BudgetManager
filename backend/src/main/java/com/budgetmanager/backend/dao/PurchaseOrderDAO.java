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
                
                    po.is_fungible,
                    po.order_sequence,
                
                    po.order_date,
                    po.created_at,
                    po.locked_at,
                
                    po.supplier_id,
                    po.budget_id,
                    po.created_by,
                
                    u.name AS created_by_name,
                    s.name AS supplier_name,
                    d.name AS department_name,
                    d.department_id
                
                FROM purchase_orders po
                
                LEFT JOIN users u ON po.created_by = u.user_id
                LEFT JOIN suppliers s ON po.supplier_id = s.supplier_id
                LEFT JOIN budgets b ON po.budget_id = b.budget_id
                LEFT JOIN departments d ON b.department_id = d.department_id
                
                WHERE po.deleted_at IS NULL
                ORDER BY po.order_date DESC;
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
                        rs.getBoolean("is_fungible"),
                        rs.getObject("order_sequence") != null ? rs.getInt("order_sequence") : null,
                        rs.getDate("order_date").toLocalDate(),
                        rs.getTimestamp("locked_at") != null
                                ? rs.getTimestamp("locked_at").toLocalDateTime()
                                : null,
                        rs.getInt("supplier_id"),
                        rs.getInt("budget_id"),
                        rs.getInt("created_by"),
                        rs.getTimestamp("created_at") != null
                                ? rs.getTimestamp("created_at").toLocalDateTime()
                                : null
                );
                po.setCreatedByName(rs.getString("created_by_name"));
                po.setSupplierName(rs.getString("supplier_name"));
                po.setDepartmentName(rs.getString("department_name"));
                po.setDepartmentId(rs.getInt("department_id"));

                purchaseOrders.add(po);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return purchaseOrders;
    }

    public ArrayList<PurchaseOrder> getPurchaseOrdersByDepartment(int departmentId) {
        ArrayList<PurchaseOrder> purchaseOrders = new ArrayList<>();

        String query = """
                SELECT
                    po.purchase_order_id,
                    po.order_amount,
                    po.notes,
                
                    po.generated_order_code,
                    po.investment_plan_code,
                
                    po.is_fungible,
                    po.order_sequence,
                
                    po.order_date,
                    po.created_at,
                    po.locked_at,
                
                    po.supplier_id,
                    po.budget_id,
                    po.created_by,
                
                    u.name AS created_by_name,
                    s.name AS supplier_name,
                    d.name AS department_name,
                    d.department_id
                
                FROM purchase_orders po
                
                LEFT JOIN users u ON po.created_by = u.user_id
                LEFT JOIN suppliers s ON po.supplier_id = s.supplier_id
                LEFT JOIN budgets b ON po.budget_id = b.budget_id
                LEFT JOIN departments d ON b.department_id = d.department_id
                
                WHERE po.deleted_at IS NULL
                  AND d.department_id = ?
                ORDER BY po.order_date DESC;
                """;

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, departmentId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                PurchaseOrder po = new PurchaseOrder(
                        rs.getInt("purchase_order_id"),
                        rs.getDouble("order_amount"),
                        rs.getString("notes"),
                        rs.getString("generated_order_code"),
                        rs.getString("investment_plan_code"),
                        rs.getBoolean("is_fungible"),
                        rs.getObject("order_sequence") != null ? rs.getInt("order_sequence") : null,
                        rs.getDate("order_date").toLocalDate(),
                        rs.getTimestamp("locked_at") != null
                                ? rs.getTimestamp("locked_at").toLocalDateTime()
                                : null,
                        rs.getInt("supplier_id"),
                        rs.getInt("budget_id"),
                        rs.getInt("created_by"),
                        rs.getTimestamp("created_at") != null
                                ? rs.getTimestamp("created_at").toLocalDateTime()
                                : null
                );

                po.setCreatedByName(rs.getString("created_by_name"));
                po.setSupplierName(rs.getString("supplier_name"));
                po.setDepartmentName(rs.getString("department_name"));
                po.setDepartmentId(rs.getInt("department_id"));

                purchaseOrders.add(po);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return purchaseOrders;
    }

    public String getNextOrderCodePreview(int budgetId, boolean isFungible) {
        String query = """
                    SELECT 
                        d.code,
                        b.fiscal_year,
                        COALESCE(bs.last_sequence, 0) + 1 AS next_seq
                    FROM budgets b
                    JOIN departments d ON b.department_id = d.department_id
                    LEFT JOIN budget_sequences bs ON bs.budget_id = b.budget_id
                    WHERE b.budget_id = ?
                """;

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, budgetId);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                String deptCode = rs.getString("code");
                int year = rs.getInt("fiscal_year");
                int nextSeq = rs.getInt("next_seq");

                String yearShort = String.valueOf(year).substring(2);

                return deptCode + "/" +
                        String.format("%04d", nextSeq) + "/" +
                        yearShort + "/" +
                        (isFungible ? "1" : "0");
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return null;
    }
}
