package com.budgetmanager.backend.dao;

import com.budgetmanager.backend.model.Role;
import com.budgetmanager.backend.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

// Handles database operations related to Role
public class RoleDAO {
    public ArrayList<Role> getAllRoles() {
        ArrayList<Role> roles = new ArrayList<>();
        String query = "SELECT * FROM roles";

        try {
            // Get DB connection
            Connection conn = DBConnection.getConnection();

            // Prepare and execute query
            PreparedStatement stmt = conn.prepareStatement(query);
            ResultSet rs = stmt.executeQuery();

            // Convert each row into a Role object
            while (rs.next()) {
                Role role = new Role(rs.getInt("role_id"), rs.getString("name"));
                roles.add(role);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return roles;
    }
}
