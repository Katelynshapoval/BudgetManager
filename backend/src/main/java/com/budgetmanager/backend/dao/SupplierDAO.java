package com.budgetmanager.backend.dao;

import com.budgetmanager.backend.model.Supplier;
import com.budgetmanager.backend.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;

// Handles all database operations related to Supplier
public class SupplierDAO {
    // Fetch all suppliers from the database
    public ArrayList<Supplier> getAllSuppliers() {
        ArrayList<Supplier> suppliers = new ArrayList<>();

        String query = "SELECT * FROM suppliers";

        try {
            // Get DB connection
            Connection conn = DBConnection.getConnection();
            
            // Prepare and execute query
            PreparedStatement stmt = conn.prepareStatement(query);
            ResultSet rs = stmt.executeQuery();

            // Convert each row into a Supplier object
            while (rs.next()) {
                Supplier supplier = new Supplier(
                        rs.getInt("supplier_id"),
                        rs.getString("name"),
                        rs.getString("email"),
                        rs.getString("phone"),
                        rs.getString("tax_id"),
                        rs.getString("notes"),
                        rs.getString("created_at"),
                        rs.getString("updated_at")
                );
                suppliers.add(supplier);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return suppliers;
    }

    public static void delete(int id) {
        String sql = "DELETE FROM suppliers WHERE supplier_id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            stmt.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
