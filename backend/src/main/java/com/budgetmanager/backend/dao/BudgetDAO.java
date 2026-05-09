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

        ArrayList<BudgetOverview> list = new ArrayList<>();

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

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, year);
            stmt.setString(2, typeName);

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

        return list;
    }

    public ArrayList<Department> getAvailableDepartments(int year, String typeName) {
        ArrayList<Department> departments = new ArrayList<>();

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

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, year);
            stmt.setString(2, typeName);

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

        return departments;
    }

    public boolean departmentHasBudget(int departmentId, int year, String typeName) {
        String sql = """
                    SELECT 1
                    FROM budgets b
                    JOIN budget_types bt ON b.budget_type_id = bt.budget_type_id
                    WHERE b.department_id = ?
                      AND b.fiscal_year = ?
                      AND LOWER(bt.name) = LOWER(?)
                    LIMIT 1
                """;

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, departmentId);
            stmt.setInt(2, year);
            stmt.setString(3, typeName);

            ResultSet rs = stmt.executeQuery();
            return rs.next();

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return false;
    }

    public Integer getBudgetTypeId(String typeName) {
        String sql = "SELECT budget_type_id FROM budget_types WHERE LOWER(name) = LOWER(?) LIMIT 1";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, typeName);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return rs.getInt("budget_type_id");
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return null;
    }

    public BudgetOverview createBudget(double allocated, int year, String notes, int departmentId, int budgetTypeId) {
        String insertSql = "INSERT INTO budgets (allocated_amount, fiscal_year, notes, department_id, budget_type_id) VALUES (?, ?, ?, ?, ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(insertSql, PreparedStatement.RETURN_GENERATED_KEYS)) {

            stmt.setDouble(1, allocated);
            stmt.setInt(2, year);
            stmt.setString(3, notes);
            stmt.setInt(4, departmentId);
            stmt.setInt(5, budgetTypeId);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                return null;
            }

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    int budgetId = generatedKeys.getInt(1);
                    return getBudgetOverviewById(conn, budgetId);
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return null;
    }

    public BudgetOverview updateBudgetAllocated(int budgetId, double allocated) {
        String updateSql = "UPDATE budgets SET allocated_amount = ? WHERE budget_id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(updateSql)) {

            stmt.setDouble(1, allocated);
            stmt.setInt(2, budgetId);

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                return null; // Budget not found
            }

            return getBudgetOverviewById(conn, budgetId);

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return null;
    }

    private BudgetOverview getBudgetOverviewById(Connection conn, int budgetId) throws SQLException {
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

        try (PreparedStatement selectStmt = conn.prepareStatement(selectSql)) {
            selectStmt.setInt(1, budgetId);
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

        return null;
    }
}
