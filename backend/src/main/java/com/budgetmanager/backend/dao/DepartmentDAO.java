package com.budgetmanager.backend.dao;

import com.budgetmanager.backend.model.Department;
import com.budgetmanager.backend.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

// Handles all database operations related to Department
public class DepartmentDAO {
    // Fetch all departments from the database
    public ArrayList<Department> getAllDepartments() {
        ArrayList<Department> departments = new ArrayList<>();
        String query = "SELECT * FROM departments";

        try {
            // Get DB connection
            Connection conn = DBConnection.getConnection();

            // Prepare and execute query
            PreparedStatement stmt = conn.prepareStatement(query);
            ResultSet rs = stmt.executeQuery();

            // Convert each row into a Supplier object
            while (rs.next()) {
                Department department = new Department(
                        rs.getString("department_id"),
                        rs.getString("name"),
                        rs.getString("code")
                );
                departments.add(department);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return departments;
    }
}
