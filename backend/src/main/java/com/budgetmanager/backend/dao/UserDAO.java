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
}