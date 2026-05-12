// Prepare the login request data
export async function loginRequest(username, password) {
  const formData = new URLSearchParams();

  formData.append("username", username);
  formData.append("password", password);

  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al iniciar sesión");
  }

  return data;
}

// Prepare the signup request data
export async function signupRequest(form) {
  const formData = new URLSearchParams();

  formData.append("username", form.username);
  formData.append("name", form.name);
  formData.append("password", form.password);
  formData.append("passwordConf", form.passwordConf);
  formData.append("roleId", form.role);

  // Add the department only when selected
  if (form.department) {
    formData.append("departmentId", form.department);
  }

  const response = await fetch("/api/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al crear la cuenta");
  }

  return data;
}
