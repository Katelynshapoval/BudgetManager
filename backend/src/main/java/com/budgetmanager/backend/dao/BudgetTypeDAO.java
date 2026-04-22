package com.budgetmanager.backend.dao;

import com.budgetmanager.backend.model.BudgetType;
import com.budgetmanager.backend.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

public class BudgetTypeDAO {

    public ArrayList<BudgetType> getAllBudgetTypes() {
        ArrayList<BudgetType> types = new ArrayList<>();

        String query = "SELECT budget_type_id, name FROM budget_types";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                BudgetType type = new BudgetType(
                        rs.getInt("budget_type_id"),
                        rs.getString("name")
                );

                types.add(type);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return types;
    }
}