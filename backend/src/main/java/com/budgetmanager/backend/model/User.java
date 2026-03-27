package com.budgetmanager.backend.model;

public class User {
    private int userId;
    private String username;
    private String name;
    private String passwordHash;
    private int roleId;
    private Integer departmentId;

    // Full constructor (used when reading from DB)
    public User(int userId, String username, String name, String passwordHash, int roleId, Integer departmentId) {
        this.userId = userId;
        this.username = username;
        this.name = name;
        this.passwordHash = passwordHash;
        this.roleId = roleId;
        this.departmentId = departmentId;
    }

    // Constructor for creating new users (no ID yet)
    public User(String username, String name, String passwordHash, int roleId, Integer departmentId) {
        this.username = username;
        this.name = name;
        this.passwordHash = passwordHash;
        this.roleId = roleId;
        this.departmentId = departmentId;
    }

    // Getters / setters
    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public int getRoleId() {
        return roleId;
    }

    public void setRoleId(int roleId) {
        this.roleId = roleId;
    }

    public Integer getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Integer departmentId) {
        this.departmentId = departmentId;
    }
}
