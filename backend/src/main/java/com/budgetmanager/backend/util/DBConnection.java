package com.budgetmanager.backend.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

// Utility class for creating DB connections
public class DBConnection {

    private static final String URL =
            "jdbc:mysql://localhost:3306/budget_manager";

    private static final String USER = "root";
    private static final String PASSWORD = "root";

    // Returns a connection to the database
    public static Connection getConnection() {
        try {
            // Load MySQL driver (required for Tomcat)
            Class.forName("com.mysql.cj.jdbc.Driver");

            // Create and return connection
            return DriverManager.getConnection(URL, USER, PASSWORD);

        } catch (Exception e) {
            throw new RuntimeException("DB connection failed", e);
        }
    }
}