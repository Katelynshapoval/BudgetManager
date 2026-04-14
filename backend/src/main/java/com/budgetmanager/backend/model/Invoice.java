package com.budgetmanager.backend.model;

import java.time.LocalDateTime;

public class Invoice {

    private int invoiceId;
    private byte[] file;
    private double amount;
    private int purchaseOrderId;
    private LocalDateTime uploadedAt;
    private LocalDateTime deletedAt;

    // Full constructor (used when reading from DB)
    public Invoice(int invoiceId, byte[] file, double amount, int purchaseOrderId,
                   LocalDateTime uploadedAt, LocalDateTime deletedAt) {
        this.invoiceId = invoiceId;
        this.file = file;
        this.amount = amount;
        this.purchaseOrderId = purchaseOrderId;
        this.uploadedAt = uploadedAt;
        this.deletedAt = deletedAt;
    }

    // Constructor for creating new invoices (no ID yet)
    public Invoice(byte[] file, double amount, int purchaseOrderId,
                   LocalDateTime uploadedAt, LocalDateTime deletedAt) {
        this.file = file;
        this.amount = amount;
        this.purchaseOrderId = purchaseOrderId;
        this.uploadedAt = uploadedAt;
        this.deletedAt = deletedAt;
    }

    // Getters and Setters

    public int getInvoiceId() {
        return invoiceId;
    }

    public void setInvoiceId(int invoiceId) {
        this.invoiceId = invoiceId;
    }

    public byte[] getFile() {
        return file;
    }

    public void setFile(byte[] file) {
        this.file = file;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public int getPurchaseOrderId() {
        return purchaseOrderId;
    }

    public void setPurchaseOrderId(int purchaseOrderId) {
        this.purchaseOrderId = purchaseOrderId;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    public LocalDateTime getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(LocalDateTime deletedAt) {
        this.deletedAt = deletedAt;
    }
}