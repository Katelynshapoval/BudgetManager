package com.budgetmanager.backend.model;

public class BudgetType {

    private int budgetTypeId;
    private String name;

    // Full constructor
    public BudgetType(int budgetTypeId, String name) {
        this.budgetTypeId = budgetTypeId;
        this.name = name;
    }

    // Constructor for create (optional)
    public BudgetType(String name) {
        this.name = name;
    }

    // Getters
    public int getBudgetTypeId() {
        return budgetTypeId;
    }

    public String getName() {
        return name;
    }

    // Setters
    public void setBudgetTypeId(int budgetTypeId) {
        this.budgetTypeId = budgetTypeId;
    }

    public void setName(String name) {
        this.name = name;
    }
}