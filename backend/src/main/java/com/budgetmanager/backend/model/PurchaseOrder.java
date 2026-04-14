package com.budgetmanager.backend.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;

public class PurchaseOrder {

    private int purchaseOrderId;
    private double orderAmount;
    private String notes;

    private String generatedOrderCode;
    private String investmentPlanCode;

    private boolean isFungible;
    private Integer orderSequence;

    private LocalDate orderDate;
    private LocalDateTime lockedAt;

    private int supplierId;
    private int budgetId;
    private int createdBy;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;

    private ArrayList<Invoice> invoices;

    // Full constructor (used when reading from DB)
    public PurchaseOrder(int purchaseOrderId, double orderAmount, String notes,
                         String generatedOrderCode, String investmentPlanCode,
                         boolean isFungible, Integer orderSequence,
                         LocalDate orderDate, LocalDateTime lockedAt,
                         int supplierId, int budgetId, int createdBy,
                         LocalDateTime createdAt, LocalDateTime updatedAt, LocalDateTime deletedAt) {

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
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }

    // Constructor for creating new orders (no ID yet)
    public PurchaseOrder(double orderAmount, String notes,
                         String generatedOrderCode, String investmentPlanCode,
                         boolean isFungible, Integer orderSequence,
                         LocalDate orderDate,
                         int supplierId, int budgetId, int createdBy) {

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public LocalDateTime getDeletedAt() {
        return deletedAt;
    }

    // Helper methods

    public String getCode() {
        return generatedOrderCode != null ? generatedOrderCode : investmentPlanCode;
    }

    public String getType() {
        return generatedOrderCode != null ? "Presupuesto" : "Inversión";
    }

    public ArrayList<Invoice> getInvoices() {
        return invoices;
    }

    public void setInvoices(ArrayList<Invoice> invoices) {
        this.invoices = invoices;
    }
}