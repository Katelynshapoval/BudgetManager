package com.budgetmanager.backend.dao;

import com.budgetmanager.backend.model.PurchaseOrder;
import com.budgetmanager.backend.util.DBConnection;

import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;

public class PurchaseOrderDAO {

    // Base query used to fetch active purchase orders from the view
    private static final String BASE_SELECT = """
            SELECT *
            FROM vw_purchase_orders
            WHERE deleted_at IS NULL
            """;

    // Fetch all active purchase orders
    public ArrayList<PurchaseOrder> getAllPurchaseOrders() {
        ArrayList<PurchaseOrder> purchaseOrders = new ArrayList<>();

        String query = BASE_SELECT + """
                ORDER BY order_date DESC;
                """;

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                purchaseOrders.add(mapPurchaseOrder(rs));
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
                AND department_id = ?
                ORDER BY order_date DESC;
                """;

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, departmentId);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    purchaseOrders.add(mapPurchaseOrder(rs));
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return purchaseOrders;
    }

    // Preview the next generated order code without saving anything
    public String getNextOrderCodePreview(
            int departmentId,
            int budgetTypeId,
            boolean isFungible
    ) {
        String query = """
            SELECT
                d.code,
                b.fiscal_year,
                COALESCE(bs.last_sequence, 0) + 1 AS next_seq

            FROM budgets b
            JOIN departments d ON b.department_id = d.department_id
            LEFT JOIN budget_sequences bs ON bs.budget_id = b.budget_id

            WHERE b.department_id = ?
              AND b.budget_type_id = ?
            LIMIT 1;
            """;

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, departmentId);
            stmt.setInt(2, budgetTypeId);

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
                WHERE purchase_order_id = ?
                  AND deleted_at IS NULL;
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
    ) throws SQLException {
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
        }

        return 0;
    }

    // Convert one database row into a PurchaseOrder object
    private PurchaseOrder mapPurchaseOrder(ResultSet rs) throws SQLException {
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

        // Add display names used by the frontend
        purchaseOrder.setCreatedByName(rs.getString("created_by_name"));
        purchaseOrder.setSupplierName(rs.getString("supplier_name"));
        purchaseOrder.setDepartmentName(rs.getString("department_name"));
        purchaseOrder.setDepartmentId(rs.getInt("department_id"));

        return purchaseOrder;
    }
}