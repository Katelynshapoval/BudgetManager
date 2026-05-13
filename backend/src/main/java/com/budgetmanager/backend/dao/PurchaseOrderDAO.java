package com.budgetmanager.backend.dao;

import com.budgetmanager.backend.model.PurchaseOrder;
import com.budgetmanager.backend.util.DBConnection;

import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;

public class PurchaseOrderDAO {

    // Base query used to fetch purchase orders with related display names
    private static final String BASE_SELECT = """
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
            """;

    // Fetch all active purchase orders
    public ArrayList<PurchaseOrder> getAllPurchaseOrders() {
        ArrayList<PurchaseOrder> purchaseOrders = new ArrayList<>();

        String query = BASE_SELECT + """
                ORDER BY po.order_date DESC;
                """;

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                PurchaseOrder purchaseOrder = new PurchaseOrder(
                        rs.getInt("purchase_order_id"),
                        rs.getDouble("order_amount"),
                        rs.getString("notes"),
                        rs.getString("generated_order_code"),
                        rs.getString("investment_plan_code"),
                        rs.getBoolean("is_fungible"),
                        rs.getObject("order_sequence") != null
                                ? rs.getInt("order_sequence")
                                : null,
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

                // Add names used by the frontend
                purchaseOrder.setCreatedByName(rs.getString("created_by_name"));
                purchaseOrder.setSupplierName(rs.getString("supplier_name"));
                purchaseOrder.setDepartmentName(rs.getString("department_name"));
                purchaseOrder.setDepartmentId(rs.getInt("department_id"));

                purchaseOrders.add(purchaseOrder);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return purchaseOrders;
    }

    // Fetch active purchase orders for one department
    public ArrayList<PurchaseOrder> getPurchaseOrdersByDepartment(int departmentId) {
        ArrayList<PurchaseOrder> purchaseOrders = new ArrayList<>();

        String query = BASE_SELECT + """
                AND d.department_id = ?
                ORDER BY po.order_date DESC;
                """;

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, departmentId);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    PurchaseOrder purchaseOrder = new PurchaseOrder(
                            rs.getInt("purchase_order_id"),
                            rs.getDouble("order_amount"),
                            rs.getString("notes"),
                            rs.getString("generated_order_code"),
                            rs.getString("investment_plan_code"),
                            rs.getBoolean("is_fungible"),
                            rs.getObject("order_sequence") != null
                                    ? rs.getInt("order_sequence")
                                    : null,
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

                    // Add names used by the frontend
                    purchaseOrder.setCreatedByName(rs.getString("created_by_name"));
                    purchaseOrder.setSupplierName(rs.getString("supplier_name"));
                    purchaseOrder.setDepartmentName(rs.getString("department_name"));
                    purchaseOrder.setDepartmentId(rs.getInt("department_id"));

                    purchaseOrders.add(purchaseOrder);
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return purchaseOrders;
    }

    // Preview the next generated order code without saving anything
    public String getNextOrderCodePreview(int budgetId, boolean isFungible) {
        String query = """
                SELECT
                    d.code,
                    b.fiscal_year,
                    COALESCE(bs.last_sequence, 0) + 1 AS next_seq
                
                FROM budgets b
                JOIN departments d ON b.department_id = d.department_id
                LEFT JOIN budget_sequences bs ON bs.budget_id = b.budget_id
                
                WHERE b.budget_id = ?;
                """;

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, budgetId);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    String deptCode = rs.getString("code");
                    int year = rs.getInt("fiscal_year");
                    int nextSeq = rs.getInt("next_seq");

                    String yearShort = String.valueOf(year).substring(2);
                    String fungibleCode = isFungible ? "1" : "0";

                    return deptCode + "/"
                            + String.format("%04d", nextSeq) + "/"
                            + yearShort + "/"
                            + fungibleCode;
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return null;
    }

    // Soft delete a purchase order
    public boolean deletePurchaseOrderById(int purchaseOrderId) {
        String query = """
                UPDATE purchase_orders
                SET deleted_at = NOW()
                WHERE purchase_order_id = ?;
                """;

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, purchaseOrderId);

            int affectedRows = stmt.executeUpdate();
            return affectedRows > 0;

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return false;
    }

    // Create a new purchase order
    public int createPurchaseOrder(
            int supplierId,
            int departmentId,
            int budgetTypeId,
            double amount,
            LocalDate orderDate,
            String notes,
            boolean isFungible,
            String investmentCode,
            int createdBy
    ) {
        String call = "{CALL create_purchase_order(?, ?, ?, ?, ?, ?, ?, ?, ?)}";

        try (Connection conn = DBConnection.getConnection();
             CallableStatement stmt = conn.prepareCall(call)) {

            stmt.setInt(1, supplierId);
            stmt.setInt(2, departmentId);
            stmt.setInt(3, budgetTypeId);
            stmt.setBigDecimal(4, java.math.BigDecimal.valueOf(amount));
            stmt.setDate(5, java.sql.Date.valueOf(orderDate));
            stmt.setString(6, notes);
            stmt.setBoolean(7, isFungible);

            if (investmentCode == null || investmentCode.trim().isEmpty()) {
                stmt.setNull(8, java.sql.Types.CHAR);
            } else {
                stmt.setString(8, investmentCode.trim());
            }

            stmt.setInt(9, createdBy);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt("purchase_order_id");
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return 0;
    }
}