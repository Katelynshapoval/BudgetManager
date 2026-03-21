package com.budgetmanager.backend.model;

public class User {
    private int userId;
    private String name;
    private String passwordHash;
    private int roleId;
    private int departmentId;

    // Full constructor (used when reading from DB)
    public User(int userId, String name, String passwordHash, int roleId, int departmentId) {
        this.userId = userId;
        this.name = name;
        this.passwordHash = passwordHash;
        this.roleId = roleId;
        this.departmentId = departmentId;
    }

    // Constructor for creating new users (no ID yet)
    public User(String name, String passwordHash, int roleId, int departmentId) {
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

    public int getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(int departmentId) {
        this.departmentId = departmentId;
    }
}
