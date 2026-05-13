package com.budgetmanager.backend.dao;

import com.budgetmanager.backend.model.User;
import com.budgetmanager.backend.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;

import java.util.ArrayList;
import java.util.List;

public class UserDAO {

    public User getUserByUsername(String username) {
        String query = """
                SELECT u.*, r.name AS role_name, d.name AS department_name
                FROM users u
                JOIN roles r ON u.role_id = r.role_id
                LEFT JOIN departments d ON u.department_id = d.department_id
                WHERE u.username = ?
                """;

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            // Find the user by username
            stmt.setString(1, username);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapRow(rs);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return null;
    }

    public boolean createUser(User user) {
        String query = """
                INSERT INTO users
                    (username, name, password_hash, role_id, department_id)
                VALUES
                    (?, ?, ?, ?, ?)
                """;

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            // Insert user data
            stmt.setString(1, user.getUsername());
            stmt.setString(2, user.getName());
            stmt.setString(3, user.getPasswordHash());
            stmt.setInt(4, user.getRoleId());

            if (user.getDepartmentId() != null) {
                stmt.setInt(5, user.getDepartmentId());
            } else {
                stmt.setNull(5, Types.INTEGER);
            }

            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<User> getUsers() {
        List<User> users = new ArrayList<>();

        String query = """
                SELECT u.*, r.name AS role_name, d.name AS department_name
                FROM users u
                JOIN roles r ON u.role_id = r.role_id
                LEFT JOIN departments d ON u.department_id = d.department_id
                """;

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) {

            // Load all users
            while (rs.next()) {
                users.add(mapRow(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return users;
    }

    public boolean updateUserStatus(int userId, String status) {
        String query = """
                UPDATE users
                SET status = ?
                WHERE user_id = ?
                """;

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            // Update the user's status
            stmt.setString(1, status);
            stmt.setInt(2, userId);

            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean updateUserPassword(int userId, String hashedPassword) {
        String query = """
                UPDATE users
                SET password_hash = ?
                WHERE user_id = ?
                """;

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            // Update the user's password
            stmt.setString(1, hashedPassword);
            stmt.setInt(2, userId);

            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    private User mapRow(ResultSet rs) throws SQLException {
        // Convert a database row into a user
        return new User(
                rs.getInt("user_id"),
                rs.getString("username"),
                rs.getString("name"),
                rs.getString("password_hash"),
                rs.getInt("role_id"),
                rs.getInt("department_id"),
                rs.getString("role_name"),
                rs.getString("status"),
                rs.getString("department_name")
        );
    }
}