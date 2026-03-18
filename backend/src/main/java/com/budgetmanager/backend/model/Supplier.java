package com.budgetmanager.backend.model;

// Represents a supplier row from the database
public class Supplier {

    private int supplierId;
    private String name;
    private String email;
    private String phone;
    private String taxId;
    private String notes;
    private String createdAt;
    private String updatedAt;

    // Full constructor (used when reading from DB)
    public Supplier(int supplierId, String supplierName, String email,
                    String phone, String taxId, String notes,
                    String createdAt, String updatedAt) {

        this.supplierId = supplierId;
        this.name = supplierName;
        this.email = email;
        this.phone = phone;
        this.taxId = taxId;
        this.notes = notes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Constructor for creating new suppliers (no ID yet)
    public Supplier(String supplierName, String email,
                    String phone, String taxId, String notes) {

        this.name = supplierName;
        this.email = email;
        this.phone = phone;
        this.taxId = taxId;
        this.notes = notes;
    }

    // Getters

    public int getSupplierId() {
        return supplierId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getTaxId() {
        return taxId;
    }

    public String getNotes() {
        return notes;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    // Setters

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setTaxId(String taxId) {
        this.taxId = taxId;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}