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
    public User getUserByUsername(String name) {
        User user = null;
        String query = "SELECT * FROM users WHERE username = ?";

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
                        rs.getString("username"),
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
        String query = "INSERT INTO users (username, name, password_hash, role_id, department_id) VALUES (?, ?, ?, ?, ?)";

        try {
            // Get DB connection
            Connection conn = DBConnection.getConnection();
            PreparedStatement stmt = conn.prepareStatement(query);

            // Prepare and execute query
            stmt.setString(1, user.getUsername());
            stmt.setString(2, user.getName());
            stmt.setString(3, user.getPasswordHash());
            stmt.setInt(4, user.getRoleId());
            if (user.getDepartmentId() != null) {
                stmt.setInt(5, user.getDepartmentId());
            } else {
                stmt.setNull(5, java.sql.Types.INTEGER);
            }

            int rowsAffected = stmt.executeUpdate();

            return rowsAffected > 0;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}