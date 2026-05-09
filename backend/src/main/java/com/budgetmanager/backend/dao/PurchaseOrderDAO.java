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
        String findBudgetQuery = """
                SELECT
                    b.budget_id,
                    b.fiscal_year,
                    d.code AS department_code
                
                FROM budgets b
                JOIN departments d ON b.department_id = d.department_id
                
                WHERE b.department_id = ?
                  AND b.budget_type_id = ?
                
                ORDER BY b.fiscal_year DESC
                LIMIT 1;
                """;

        String ensureSequenceQuery = """
                INSERT INTO budget_sequences (budget_id, last_sequence)
                VALUES (?, 0)
                ON DUPLICATE KEY UPDATE budget_id = budget_id;
                """;

        String getSequenceQuery = """
                SELECT last_sequence
                FROM budget_sequences
                WHERE budget_id = ?
                FOR UPDATE;
                """;

        String updateSequenceQuery = """
                UPDATE budget_sequences
                SET last_sequence = ?
                WHERE budget_id = ?;
                """;

        String insertOrderQuery = """
                INSERT INTO purchase_orders (
                    order_amount,
                    notes,
                    generated_order_code,
                    investment_plan_code,
                    is_fungible,
                    order_sequence,
                    order_date,
                    supplier_id,
                    budget_id,
                    created_by,
                    created_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW());
                """;

        Connection conn = null;

        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false);

            int budgetId;
            int fiscalYear;
            String departmentCode;

            // Find the budget that belongs to the selected department and budget type
            try (PreparedStatement stmt = conn.prepareStatement(findBudgetQuery)) {
                stmt.setInt(1, departmentId);
                stmt.setInt(2, budgetTypeId);

                try (ResultSet rs = stmt.executeQuery()) {
                    if (!rs.next()) {
                        conn.rollback();
                        return 0;
                    }

                    budgetId = rs.getInt("budget_id");
                    fiscalYear = rs.getInt("fiscal_year");
                    departmentCode = rs.getString("department_code");
                }
            }

            String generatedCode = null;
            Integer orderSequence = null;

            // Only normal budget orders need an automatic generated code
            if (investmentCode == null) {
                try (PreparedStatement stmt = conn.prepareStatement(ensureSequenceQuery)) {
                    stmt.setInt(1, budgetId);
                    stmt.executeUpdate();
                }

                try (PreparedStatement stmt = conn.prepareStatement(getSequenceQuery)) {
                    stmt.setInt(1, budgetId);

                    try (ResultSet rs = stmt.executeQuery()) {
                        if (!rs.next()) {
                            conn.rollback();
                            return 0;
                        }

                        orderSequence = rs.getInt("last_sequence") + 1;
                    }
                }

                try (PreparedStatement stmt = conn.prepareStatement(updateSequenceQuery)) {
                    stmt.setInt(1, orderSequence);
                    stmt.setInt(2, budgetId);
                    stmt.executeUpdate();
                }

                String yearShort = String.valueOf(fiscalYear).substring(2);
                String fungibleCode = isFungible ? "1" : "0";

                generatedCode = departmentCode + "/"
                        + String.format("%04d", orderSequence) + "/"
                        + yearShort + "/"
                        + fungibleCode;
            }

            // Save the purchase order
            try (PreparedStatement stmt = conn.prepareStatement(
                    insertOrderQuery,
                    Statement.RETURN_GENERATED_KEYS
            )) {
                stmt.setDouble(1, amount);
                stmt.setString(2, notes);
                stmt.setString(3, generatedCode);
                stmt.setString(4, investmentCode);
                stmt.setBoolean(5, isFungible);

                if (orderSequence == null) {
                    stmt.setNull(6, java.sql.Types.INTEGER);
                } else {
                    stmt.setInt(6, orderSequence);
                }

                stmt.setDate(7, java.sql.Date.valueOf(orderDate));
                stmt.setInt(8, supplierId);
                stmt.setInt(9, budgetId);
                stmt.setInt(10, createdBy);

                stmt.executeUpdate();

                try (ResultSet keys = stmt.getGeneratedKeys()) {
                    if (keys.next()) {
                        int purchaseOrderId = keys.getInt(1);
                        conn.commit();
                        return purchaseOrderId;
                    }
                }
            }

            conn.rollback();

        } catch (SQLException e) {
            e.printStackTrace();

            try {
                if (conn != null) {
                    conn.rollback();
                }
            } catch (SQLException rollbackError) {
                rollbackError.printStackTrace();
            }

        } finally {
            try {
                if (conn != null) {
                    conn.setAutoCommit(true);
                    conn.close();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        return 0;
    }
}