package com.budgetmanager.backend.util;

import com.budgetmanager.backend.model.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

public class AuthUtil {

    public static User getUser(HttpServletRequest req) {
        HttpSession session = req.getSession(false);
        if (session == null) return null;

        Object userObj = session.getAttribute("user");
        if (userObj instanceof User user) {
            return user;
        }
        return null;
    }

    public static boolean requireAdmin(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        User currentUser = getUser(req);

        if (currentUser == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return false;
        }

        if (!"admin".equals(currentUser.getRoleName())) {
            resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return false;
        }

        return true;
    }
}