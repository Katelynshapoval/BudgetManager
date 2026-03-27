package com.budgetmanager.backend.util;

import com.google.gson.Gson;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public class ResponseUtil {
    protected static final String FRONTEND_ORIGIN = "http://localhost:5173";

    public static void setupJsonResponse(HttpServletResponse resp) {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.setHeader("Access-Control-Allow-Origin", FRONTEND_ORIGIN);
        resp.setHeader("Access-Control-Allow-Credentials", "true");
    }

    public static void sendJson(HttpServletResponse resp, Object data) throws IOException {
        resp.getWriter().write(new Gson().toJson(data));
    }
}
