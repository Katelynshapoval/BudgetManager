// Fetch all users
export async function fetchUsers() {
  const response = await fetch("/api/users");

  return response.json();
}

// Update a user status
export async function updateUserStatus({ userId, status }) {
  const response = await fetch("/api/users/status", {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      status,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update user status");
  }

  return response.json();
}

// Update a user password
export async function updateUserPassword({ userId, newPassword }) {
  const response = await fetch("/api/users/password", {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      newPassword,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update password");
  }

  return response.json();
}
