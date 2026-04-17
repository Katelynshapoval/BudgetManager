package com.budgetmanager.backend.controller;

import com.budgetmanager.backend.dao.SupplierDAO;
import com.budgetmanager.backend.model.Supplier;
import com.budgetmanager.backend.util.ResponseUtil;
import com.google.gson.Gson;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.util.ArrayList;

// API endpoint for suppliers
@WebServlet("/api/suppliers")
public class SupplierServlet extends HttpServlet {

    private final SupplierDAO supplierDAO = new SupplierDAO();
    private final Gson gson = new Gson(); // JSON converter

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {

        // Get data from DB
        ArrayList<Supplier> suppliers = supplierDAO.getAllSuppliers();

        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.setHeader("Access-Control-Allow-Origin", "*");
        String json = gson.toJson(suppliers);

        // Send response
        resp.getWriter().write(json);
    }

    @Override
<<<<<<< HEAD
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        ResponseUtil.setupJsonResponse(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        ResponseUtil.setupJsonResponse(response);

        String idParam = request.getParameter("id");
        System.out.println("DELETE request recibido, ID: " + idParam);

        if (idParam != null && !idParam.isEmpty()) {
            try {
                int id = Integer.parseInt(idParam);
                System.out.println("Llamando a supplierDAO.delete con ID: " + id);
                supplierDAO.delete(id);
                System.out.println("DELETE completado exitosamente");
                response.setStatus(HttpServletResponse.SC_OK);
                response.getWriter().write("{\"success\": true}");
            } catch (NumberFormatException e) {
                System.out.println("Error: ID inválido - " + idParam);
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"error\": \"ID inválido\"}");
            } catch (Exception e) {
                System.out.println("Error interno en DELETE: " + e.getMessage());
                e.printStackTrace();
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write("{\"error\": \"Error al eliminar el proveedor\"}");
            }
        } else {
            System.out.println("Error: ID requerido faltante");
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"ID requerido\"}");
        }
    }
}