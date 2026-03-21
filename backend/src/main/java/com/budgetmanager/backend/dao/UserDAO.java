package com.budgetmanager.backend.dao;

import com.budgetmanager.backend.model.User;
import com.budgetmanager.backend.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

// Handles database operations related to User
public class UserDAO {

    // Fetch a user by name (for login)
    public User getUserByName(String name) {
        User user = null;
        String query = "SELECT * FROM users WHERE name = ?";

        try {
            // Get DB connection
            Connection conn = DBConnection.getConnection();

            // Prepare and execute query
            PreparedStatement stmt = conn.prepareStatement(query);
            stmt.setString(1, name);
            ResultSet rs = stmt.executeQuery();

            // If user exists, create User object
            if (rs.next()) {
                user = new User(
                        rs.getInt("user_id"),
                        rs.getString("name"),
                        rs.getString("password_hash"),
                        rs.getInt("role_id"),
                        rs.getInt("department_id")
                );
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return user; // not found
    }

    public boolean createUser(User user) {
        String query = "INSERT INTO users (name, password_hash, role_id, department_id) VALUES (?, ?, ?, ?)";

        try {
            // Get DB connection
            Connection conn = DBConnection.getConnection();
            PreparedStatement stmt = conn.prepareStatement(query);

            // Prepare and execute query
            stmt.setString(1, user.getName());
            stmt.setString(2, user.getPasswordHash());
            stmt.setInt(3, user.getRoleId());
            if (user.getDepartmentId() != null) {
                stmt.setInt(4, user.getDepartmentId());
            } else {
                stmt.setNull(4, java.sql.Types.INTEGER);
            }

            int rowsAffected = stmt.executeUpdate();

            return rowsAffected > 0;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}