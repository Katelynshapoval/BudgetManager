package com.budgetmanager.backend.util;

import com.budgetmanager.backend.model.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

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
}