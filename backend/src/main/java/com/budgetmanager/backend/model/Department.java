package com.budgetmanager.backend.model;

// Represents a department row from the database
public class Department {
    private String departmentId;
    private String name;
    private String code;

    // Full constructor (used when reading from DB)
    public Department(String departmentId, String name, String code) {
        this.departmentId = departmentId;
        this.name = name;
        this.code = code;
    }

    // Getters / setters
    public String getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(String departmentId) {
        this.departmentId = departmentId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
