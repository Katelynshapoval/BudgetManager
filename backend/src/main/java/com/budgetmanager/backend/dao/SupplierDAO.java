package com.budgetmanager.backend.dao;

import com.budgetmanager.backend.model.Supplier;
import com.budgetmanager.backend.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;

public class SupplierDAO {

    public ArrayList<Supplier> getAllSuppliers() {
        ArrayList<Supplier> suppliers = new ArrayList<>();
        String query = "SELECT * FROM suppliers WHERE deleted_at IS NULL";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) {

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

            stmt.setInt(1, departmentId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                suppliers.add(mapRow(rs));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return suppliers;
    }

    public void deleteSupplierById(int id) {
        String sql = "UPDATE suppliers SET deleted_at = NOW() WHERE supplier_id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            stmt.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private Supplier mapRow(ResultSet rs) throws SQLException {
        return new Supplier(
                rs.getInt("supplier_id"),
                rs.getString("name"),
                rs.getString("email"),
                rs.getString("phone"),
                rs.getString("tax_id"),
                rs.getString("notes"),
                rs.getString("created_at"),
                rs.getString("updated_at")
        );
    }
}
