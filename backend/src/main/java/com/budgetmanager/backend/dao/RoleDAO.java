package com.budgetmanager.backend.dao;

import com.budgetmanager.backend.model.Role;
import com.budgetmanager.backend.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

public class RoleDAO {

    public ArrayList<Role> getAllRoles() {
        ArrayList<Role> roles = new ArrayList<>();
        String query = "SELECT * FROM roles";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                roles.add(new Role(rs.getInt("role_id"), rs.getString("name")));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return roles;
    }
}
