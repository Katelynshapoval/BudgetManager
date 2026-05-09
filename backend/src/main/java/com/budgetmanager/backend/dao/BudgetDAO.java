package com.budgetmanager.backend.dao;

import com.budgetmanager.backend.model.BudgetOverview;
import com.budgetmanager.backend.model.Department;
import com.budgetmanager.backend.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

public class BudgetDAO {

    public ArrayList<BudgetOverview> getBudgetOverview(int year, String typeName) {
        // Create the list that will store the budget overview rows
        ArrayList<BudgetOverview> list = new ArrayList<>();

        // Select the budget overview data for the selected fiscal year and budget type
        String sql = """
                    SELECT 
                        dbo.department_id,
                        dbo.department,
                        dbo.budget_id,
                        dbo.allocated,
                        dbo.spent,
                        dbo.remaining
                    FROM department_budget_overview dbo
                    JOIN budgets b ON dbo.budget_id = b.budget_id
                    JOIN budget_types bt ON b.budget_type_id = bt.budget_type_id
                    WHERE dbo.fiscal_year = ?
                      AND LOWER(bt.name) = LOWER(?)
                """;

        // Open the database connection and prepare the query
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            // Set the query parameters
            stmt.setInt(1, year);
            stmt.setString(2, typeName);

            // Run the query and read each result row
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                list.add(new BudgetOverview(
                        rs.getInt("department_id"),
                        rs.getString("department"),
                        rs.getInt("budget_id"),
                        rs.getDouble("allocated"),
                        rs.getDouble("spent"),
                        rs.getDouble("remaining")
                ));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        // Return the budget overview list
        return list;
    }

    public ArrayList<Department> getAvailableDepartments(int year, String typeName) {
        // Create the list that will store departments without a budget for this year and type
        ArrayList<Department> departments = new ArrayList<>();

        // Select departments that do not already have a budget for the selected year and type
        String sql = """
                    SELECT d.department_id, d.name, d.code
                    FROM departments d
                    WHERE d.department_id NOT IN (
                        SELECT b.department_id
                        FROM budgets b
                        JOIN budget_types bt ON b.budget_type_id = bt.budget_type_id
                        WHERE b.fiscal_year = ?
                          AND LOWER(bt.name) = LOWER(?)
                    )
                    ORDER BY d.name
                """;

        // Open the database connection and prepare the query
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            // Set the query parameters
            stmt.setInt(1, year);
            stmt.setString(2, typeName);

            // Run the query and read each available department
            ResultSet rs = stmt.executeQuery();

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

        // Return the available departments
        return departments;
    }

    public boolean departmentHasBudget(int departmentId, int year, String typeName) {
        // Check if this department already has a budget for the selected year and type
        String sql = """
                    SELECT 1
                    FROM budgets b
                    JOIN budget_types bt ON b.budget_type_id = bt.budget_type_id
                    WHERE b.department_id = ?
                      AND b.fiscal_year = ?
                      AND LOWER(bt.name) = LOWER(?)
                    LIMIT 1
                """;

        // Open the database connection and prepare the query
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            // Set the query parameters
            stmt.setInt(1, departmentId);
            stmt.setInt(2, year);
            stmt.setString(3, typeName);

            // Return true if the query finds an existing budget
            ResultSet rs = stmt.executeQuery();
            return rs.next();

        } catch (SQLException e) {
            e.printStackTrace();
        }

        // Return false if the check fails
        return false;
    }

    public Integer getBudgetTypeId(String typeName) {
        // Select the budget type id using the type name
        String sql = "SELECT budget_type_id FROM budget_types WHERE LOWER(name) = LOWER(?) LIMIT 1";

        // Open the database connection and prepare the query
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            // Set the query parameter
            stmt.setString(1, typeName);

            // Return the budget type id if it exists
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return rs.getInt("budget_type_id");
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        // Return null if the budget type was not found
        return null;
    }

    public BudgetOverview createBudget(double allocated, int year, int departmentId, int budgetTypeId) {
        // Insert a new budget without notes
        String insertSql = """
                    INSERT INTO budgets (allocated_amount, fiscal_year, department_id, budget_type_id)
                    VALUES (?, ?, ?, ?)
                """;

        // Open the database connection and prepare the insert statement
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(insertSql, PreparedStatement.RETURN_GENERATED_KEYS)) {

            // Set the insert values
            stmt.setDouble(1, allocated);
            stmt.setInt(2, year);
            stmt.setInt(3, departmentId);
            stmt.setInt(4, budgetTypeId);

            // Run the insert and check that a row was created
            int affectedRows = stmt.executeUpdate();

            if (affectedRows == 0) {
                return null;
            }

            // Read the generated budget id and return the created budget overview
            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    int budgetId = generatedKeys.getInt(1);
                    return getBudgetOverviewById(conn, budgetId);
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        // Return null if the budget could not be created
        return null;
    }

    public BudgetOverview updateBudgetAllocated(int budgetId, double allocated) {
        // Update only the allocated amount for the selected budget
        String updateSql = "UPDATE budgets SET allocated_amount = ? WHERE budget_id = ?";

        // Open the database connection and prepare the update statement
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(updateSql)) {

            // Set the update values
            stmt.setDouble(1, allocated);
            stmt.setInt(2, budgetId);

            // Run the update and check that the budget exists
            int affectedRows = stmt.executeUpdate();

            if (affectedRows == 0) {
                return null;
            }

            // Return the updated budget overview
            return getBudgetOverviewById(conn, budgetId);

        } catch (SQLException e) {
            e.printStackTrace();
        }

        // Return null if the budget could not be updated
        return null;
    }

    private BudgetOverview getBudgetOverviewById(Connection conn, int budgetId) throws SQLException {
        // Select one budget overview row by budget id
        String selectSql = """
                    SELECT
                        dbo.department_id,
                        dbo.department,
                        dbo.budget_id,
                        dbo.allocated,
                        dbo.spent,
                        dbo.remaining
                    FROM department_budget_overview dbo
                    WHERE dbo.budget_id = ?
                """;

        // Prepare the query using the existing connection
        try (PreparedStatement selectStmt = conn.prepareStatement(selectSql)) {
            // Set the budget id parameter
            selectStmt.setInt(1, budgetId);

            // Run the query and return the budget overview if it exists
            ResultSet rs = selectStmt.executeQuery();

            if (rs.next()) {
                return new BudgetOverview(
                        rs.getInt("department_id"),
                        rs.getString("department"),
                        rs.getInt("budget_id"),
                        rs.getDouble("allocated"),
                        rs.getDouble("spent"),
                        rs.getDouble("remaining")
                );
            }
        }

        // Return null if no budget overview was found
        return null;
    }
}