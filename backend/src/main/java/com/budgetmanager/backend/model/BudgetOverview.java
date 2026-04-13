package com.budgetmanager.backend.model;

public class BudgetOverview {

    private int departmentId;
    private String department;
    private int budgetId;
    private double allocated;
    private double spent;
    private double remaining;

    public BudgetOverview(int departmentId, String department,
                          int budgetId, double allocated,
                          double spent, double remaining) {
        this.departmentId = departmentId;
        this.department = department;
        this.budgetId = budgetId;
        this.allocated = allocated;
        this.spent = spent;
        this.remaining = remaining;
    }

    // getters
    public int getDepartmentId() {
        return departmentId;
    }

    public String getDepartment() {
        return department;
    }

    public int getBudgetId() {
        return budgetId;
    }

    public double getAllocated() {
        return allocated;
    }

    public double getSpent() {
        return spent;
    }

    public double getRemaining() {
        return remaining;
    }
}