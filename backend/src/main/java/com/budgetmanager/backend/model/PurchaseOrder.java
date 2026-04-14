package com.budgetmanager.backend.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;

public class PurchaseOrder {

    // IDs
    private int purchaseOrderId;
    private int supplierId;
    private int budgetId;
    private int departmentId;
    private int createdBy;

    // Core data
    private double orderAmount;
    private String notes;
    private String generatedOrderCode;
    private String investmentPlanCode;
    private boolean isFungible;
    private Integer orderSequence;

    // Dates
    private LocalDate orderDate;
    private LocalDateTime createdAt;
    private LocalDateTime lockedAt;

    // Display
    private String supplierName;
    private String createdByName;
    private String departmentName;

    // Relations
    private ArrayList<Invoice> invoices = new ArrayList<>();

    // Full constructor (DB)
    public PurchaseOrder(int purchaseOrderId,
                         double orderAmount,
                         String notes,
                         String generatedOrderCode,
                         String investmentPlanCode,
                         boolean isFungible,
                         Integer orderSequence,
                         LocalDate orderDate,
                         LocalDateTime lockedAt,
                         int supplierId,
                         int budgetId,
                         int createdBy,
                         LocalDateTime createdAt) {

        this.purchaseOrderId = purchaseOrderId;
        this.orderAmount = orderAmount;
        this.notes = notes;
        this.generatedOrderCode = generatedOrderCode;
        this.investmentPlanCode = investmentPlanCode;
        this.isFungible = isFungible;
        this.orderSequence = orderSequence;
        this.orderDate = orderDate;
        this.lockedAt = lockedAt;
        this.supplierId = supplierId;
        this.budgetId = budgetId;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
    }

    // Constructor for creating new orders
    public PurchaseOrder(double orderAmount,
                         String notes,
                         String generatedOrderCode,
                         String investmentPlanCode,
                         boolean isFungible,
                         Integer orderSequence,
                         LocalDate orderDate,
                         int supplierId,
                         int budgetId,
                         int createdBy) {

        this.orderAmount = orderAmount;
        this.notes = notes;
        this.generatedOrderCode = generatedOrderCode;
        this.investmentPlanCode = investmentPlanCode;
        this.isFungible = isFungible;
        this.orderSequence = orderSequence;
        this.orderDate = orderDate;
        this.supplierId = supplierId;
        this.budgetId = budgetId;
        this.createdBy = createdBy;
    }

    // Getters

    public int getPurchaseOrderId() {
        return purchaseOrderId;
    }

    public double getOrderAmount() {
        return orderAmount;
    }

    public String getNotes() {
        return notes;
    }

    public String getGeneratedOrderCode() {
        return generatedOrderCode;
    }

    public String getInvestmentPlanCode() {
        return investmentPlanCode;
    }

    public boolean isFungible() {
        return isFungible;
    }

    public Integer getOrderSequence() {
        return orderSequence;
    }

    public LocalDate getOrderDate() {
        return orderDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getLockedAt() {
        return lockedAt;
    }

    public int getSupplierId() {
        return supplierId;
    }

    public int getBudgetId() {
        return budgetId;
    }

    public int getCreatedBy() {
        return createdBy;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public String getCreatedByName() {
        return createdByName;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public ArrayList<Invoice> getInvoices() {
        return invoices;
    }
    
    public int getDepartmentId() {
        return departmentId;
    }

    // Setters

    public void setInvoices(ArrayList<Invoice> invoices) {
        this.invoices = invoices;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public void setCreatedByName(String createdByName) {
        this.createdByName = createdByName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public void setDepartmentId(int departmentId) {
        this.departmentId = departmentId;
    }

    // Helper methods

    public String getCode() {
        return generatedOrderCode != null ? generatedOrderCode : investmentPlanCode;
    }

    public String getType() {
        return generatedOrderCode != null ? "Presupuesto" : "Inversión";
    }

    public boolean isLocked() {
        return lockedAt != null;
    }
}