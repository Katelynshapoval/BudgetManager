package com.budgetmanager.backend.dao;

import com.budgetmanager.backend.model.BudgetOverview;
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
}