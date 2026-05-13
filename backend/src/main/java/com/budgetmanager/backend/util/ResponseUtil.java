package com.budgetmanager.backend.util;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializer;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ResponseUtil {

    private static final String FRONTEND_ORIGIN = "http://localhost:5173";

    private static final Gson GSON = new GsonBuilder()
            .registerTypeAdapter(LocalDate.class, (JsonSerializer<LocalDate>)
                    (src, typeOfSrc, context) -> new JsonPrimitive(src.toString()))
            .registerTypeAdapter(LocalDateTime.class, (JsonSerializer<LocalDateTime>)
                    (src, typeOfSrc, context) -> new JsonPrimitive(src.toString()))
            .create();

    public static void setupJsonResponse(HttpServletResponse response) {
        // Prepare a JSON response
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        applyCorsHeaders(response);
    }

    public static void setupFileResponse(HttpServletResponse response, String contentType) {
        // Prepare a file response
        response.setContentType(contentType);
        response.setCharacterEncoding("UTF-8");
        applyCorsHeaders(response);
    }

    public static void sendJson(HttpServletResponse response, Object data) throws IOException {
        // Send data as JSON
        response.getWriter().write(GSON.toJson(data));
    }

    private static void applyCorsHeaders(HttpServletResponse response) {
        // Apply common CORS headers
        response.setHeader("Access-Control-Allow-Origin", FRONTEND_ORIGIN);
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }
}