export async function loginRequest(username, password) {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const response = await fetch("http://localhost:8080/api/login", {
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

export async function signupRequest(form) {
  const formData = new URLSearchParams();

  formData.append("username", form.username);
  formData.append("name", form.name);
  formData.append("password", form.password);
  formData.append("passwordConf", form.passwordConf);
  formData.append("roleId", form.role);

  if (form.department) {
    formData.append("departmentId", form.department);
  }

  const res = await fetch("http://localhost:8080/api/signup", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Error al crear la cuenta");
  }

  return data;
}
