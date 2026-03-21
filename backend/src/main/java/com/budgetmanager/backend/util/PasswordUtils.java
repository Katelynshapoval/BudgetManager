package com.budgetmanager.backend.util;

import at.favre.lib.crypto.bcrypt.BCrypt;

public class PasswordUtils {
    // Hash a password
    public static String hashPassword(String plainPassword) {
        return BCrypt.withDefaults().hashToString(12, plainPassword.toCharArray());
    }

    // Verify a password against a stored hash
    public static boolean verifyPassword(String plainPassword, String hashedPassword) {
        BCrypt.Result result = BCrypt.verifyer().verify(plainPassword.toCharArray(), hashedPassword);
        return result.verified;
    }

}
