package com.budgetmanager.backend.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

// Utility class for creating DB connections
public class DBConnection {
    // Returns a connection to the database
    public static Connection getConnection() {
        try {
            // Load MySQL driver (required for Tomcat)
            Class.forName("com.mysql.cj.jdbc.Driver");

            // Create and return connection
            return DriverManager.getConnection(
                    ConfigLoader.get("db.url"),
                    ConfigLoader.get("db.user"),
                    ConfigLoader.get("db.password")
            );

        } catch (Exception e) {
            throw new RuntimeException("DB connection failed", e);
        }
    }
}