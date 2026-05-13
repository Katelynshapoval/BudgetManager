package com.budgetmanager.backend.util;

import com.budgetmanager.backend.model.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

public class AuthUtil {

    public static User getUser(HttpServletRequest request) {
        // Get the current session user
        HttpSession session = request.getSession(false);

        if (session == null) {
            return null;
        }

        Object userObject = session.getAttribute("user");

        if (userObject instanceof User user) {
            return user;
        }

        return null;
    }

    public static boolean requireAdmin(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Check if the current user is an admin
        User currentUser = getUser(request);

        if (currentUser == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            ResponseUtil.sendJson(response, java.util.Map.of("error", "Not authenticated"));
            return false;
        }

        if (!"admin".equalsIgnoreCase(currentUser.getRoleName())) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            ResponseUtil.sendJson(response, java.util.Map.of("error", "Not authorized"));
            return false;
        }

        return true;
    }
}