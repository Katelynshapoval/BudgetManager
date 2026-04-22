package com.budgetmanager.backend.dao;

import com.budgetmanager.backend.model.User;
import com.budgetmanager.backend.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class UserDAO {

    public User getUserByUsername(String username) {
        String query = "SELECT u.*, r.name AS role_name " +
                "FROM users u " +
                "JOIN roles r ON u.role_id = r.role_id " +
                "WHERE u.username = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, username);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return new User(
                        rs.getInt("user_id"),
                        rs.getString("username"),
                        rs.getString("name"),
                        rs.getString("password_hash"),
                        rs.getInt("role_id"),
                        rs.getInt("department_id"),
                        rs.getString("role_name")
                );
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return null;
    }

    public boolean createUser(User user) {
        String query = "INSERT INTO users (username, name, password_hash, role_id, department_id) VALUES (?, ?, ?, ?, ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, user.getUsername());
            stmt.setString(2, user.getName());
            stmt.setString(3, user.getPasswordHash());
            stmt.setInt(4, user.getRoleId());

            if (user.getDepartmentId() != null) {
                stmt.setInt(5, user.getDepartmentId());
            } else {
                stmt.setNull(5, java.sql.Types.INTEGER);
            }

            return stmt.executeUpdate() > 0;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}
