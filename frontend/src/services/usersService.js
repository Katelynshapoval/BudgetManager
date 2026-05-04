export async function fetchUsers() {
  const res = await fetch(`/api/users`);
  return res.json();
}

export async function updateUserStatus({ userId, status }) {
  const res = await fetch("/api/users/status", {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      status, // "active" | "inactive" | "pending"
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to update user status");
  }

  return res.json();
}

export async function updateUserPassword({ userId, newPassword }) {
  const res = await fetch("/api/users/password", {
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

  if (!res.ok) {
    throw new Error("Failed to update password");
  }

  return res.json();
}
