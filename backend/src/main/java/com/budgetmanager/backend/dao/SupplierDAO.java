package com.budgetmanager.backend.dao;

import com.budgetmanager.backend.model.Supplier;
import com.budgetmanager.backend.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

public class SupplierDAO {

    public ArrayList<Supplier> getAllSuppliers() {
        ArrayList<Supplier> suppliers = new ArrayList<>();
        String query = "SELECT * FROM suppliers WHERE deleted_at IS NULL";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) {

            // Map all active suppliers
            while (rs.next()) {
                suppliers.add(mapRow(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return suppliers;
    }

    public ArrayList<Supplier> getSuppliersForUser(int departmentId) {
        ArrayList<Supplier> suppliers = new ArrayList<>();

        String query = """
                SELECT DISTINCT s.*
                FROM suppliers s
                LEFT JOIN supplier_department sd
                    ON s.supplier_id = sd.supplier_id
                WHERE s.deleted_at IS NULL
                  AND (
                        s.is_shared = 1
                        OR sd.department_id = ?
                      )
                """;

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            // Load shared and department suppliers
            stmt.setInt(1, departmentId);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    suppliers.add(mapRow(rs));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return suppliers;
    }

    public Supplier createSupplier(Supplier supplier) {
        String sql = """
                INSERT INTO suppliers
                    (name, email, phone, tax_id, notes, is_shared, created_at, updated_at)
                VALUES
                    (?, ?, ?, ?, ?, ?, NOW(), NOW())
                """;

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            // Insert supplier data
            stmt.setString(1, supplier.getName());
            stmt.setString(2, supplier.getEmail());
            stmt.setString(3, supplier.getPhone());
            stmt.setString(4, supplier.getTaxId());
            stmt.setString(5, supplier.getNotes());
            stmt.setBoolean(6, supplier.isShared());

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Creating supplier failed, no rows affected.");
            }

            // Return the created supplier
            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    int newId = generatedKeys.getInt(1);

                    return new Supplier(
                            newId,
                            supplier.getName(),
                            supplier.getEmail(),
                            supplier.getPhone(),
                            supplier.getTaxId(),
                            supplier.getNotes(),
                            supplier.isShared(),
                            null,
                            null
                    );
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return null;
    }

    public Supplier updateSupplier(Supplier supplier) {
        String sql = """
                UPDATE suppliers
                SET name = ?,
                    email = ?,
                    phone = ?,
                    tax_id = ?,
                    notes = ?,
                    updated_at = NOW()
                WHERE supplier_id = ?
                """;

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            // Update supplier data
            stmt.setString(1, supplier.getName());
            stmt.setString(2, supplier.getEmail());
            stmt.setString(3, supplier.getPhone());
            stmt.setString(4, supplier.getTaxId());
            stmt.setString(5, supplier.getNotes());
            stmt.setInt(6, supplier.getSupplierId());

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                return null;
            }

            return supplier;
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return null;
    }

    public void deleteSupplierById(int id) {
        String sql = "UPDATE suppliers SET deleted_at = NOW() WHERE supplier_id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            // Soft delete the supplier
            stmt.setInt(1, id);
            stmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public String assignSupplierToDepartment(int supplierId, int departmentId) {
        String checkSql = """
                SELECT COUNT(*)
                FROM supplier_department
                WHERE supplier_id = ?
                  AND department_id = ?
                """;

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement checkStmt = conn.prepareStatement(checkSql)) {

            // Check if the supplier is already assigned
            checkStmt.setInt(1, supplierId);
            checkStmt.setInt(2, departmentId);

            try (ResultSet rs = checkStmt.executeQuery()) {
                if (rs.next() && rs.getInt(1) > 0) {
                    return "already_assigned";
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return "error";
        }

        String insertSql = """
                INSERT INTO supplier_department
                    (supplier_id, department_id)
                VALUES
                    (?, ?)
                """;

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(insertSql)) {

            // Assign the supplier to the department
            stmt.setInt(1, supplierId);
            stmt.setInt(2, departmentId);
            stmt.executeUpdate();

            return "assigned";
        } catch (SQLException e) {
            e.printStackTrace();
            return "error";
        }
    }

    private Supplier mapRow(ResultSet rs) throws SQLException {
        // Convert a database row into a supplier
        return new Supplier(
                rs.getInt("supplier_id"),
                rs.getString("name"),
                rs.getString("email"),
                rs.getString("phone"),
                rs.getString("tax_id"),
                rs.getString("notes"),
                rs.getBoolean("is_shared"),
                rs.getString("created_at"),
                rs.getString("updated_at")
        );
    }
}