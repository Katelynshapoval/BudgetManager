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

    public static void setupJsonResponse(HttpServletResponse resp) {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        applyCorsHeaders(resp);
    }

    public static void setupFileResponse(HttpServletResponse resp, String contentType) {
        resp.setContentType(contentType);
        resp.setCharacterEncoding("UTF-8");
        applyCorsHeaders(resp);
    }

    public static void sendJson(HttpServletResponse resp, Object data) throws IOException {
        resp.getWriter().write(GSON.toJson(data));
    }

    private static void applyCorsHeaders(HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", FRONTEND_ORIGIN);
        resp.setHeader("Access-Control-Allow-Credentials", "true");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }
}
