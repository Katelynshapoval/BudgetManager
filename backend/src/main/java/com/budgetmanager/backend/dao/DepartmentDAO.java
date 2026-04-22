package com.budgetmanager.backend.dao;

import com.budgetmanager.backend.model.Department;
import com.budgetmanager.backend.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

public class DepartmentDAO {

    public ArrayList<Department> getAllDepartments() {
        ArrayList<Department> departments = new ArrayList<>();
        String query = "SELECT * FROM departments";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                departments.add(new Department(
                        rs.getString("department_id"),
                        rs.getString("name"),
                        rs.getString("code")
                ));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return departments;
    }
}
