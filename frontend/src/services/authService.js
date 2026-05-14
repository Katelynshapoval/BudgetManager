// Safely read JSON without crashing when the response is empty or not JSON
async function readJsonSafely(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// Get a readable error message from the backend response
function getErrorMessage(response, data, fallback) {
  if (data?.error) {
    return data.error;
  }

  if (data?.message) {
    return data.message;
  }

  // Common cases when the backend server is down behind a proxy
  if ([502, 503, 504].includes(response.status)) {
    return "No se pudo conectar con el servidor";
  }

  // Empty response from backend
  if (!data) {
    return "El servidor no respondió correctamente";
  }

  return fallback;
}

// Prepare the login request data
export async function loginRequest(username, password) {
  const formData = new URLSearchParams();

  formData.append("username", username);
  formData.append("password", password);

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
      credentials: "include",
    });

    const data = await readJsonSafely(response);

    if (!response.ok) {
      throw new Error(
          getErrorMessage(response, data, "Error al iniciar sesión")
      );
    }

    return data;
  } catch (error) {
    // This catches true network errors, for example no internet or failed fetch
    if (error instanceof TypeError) {
      throw new Error("No se pudo conectar con el servidor");
    }

    throw error;
  }
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

  try {
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
      credentials: "include",
    });

    const data = await readJsonSafely(response);

    if (!response.ok) {
      throw new Error(
          getErrorMessage(response, data, "Error al crear la cuenta")
      );
    }

    return data;
  } catch (error) {
    // This catches true network errors, for example no internet or failed fetch
    if (error instanceof TypeError) {
      throw new Error("No se pudo conectar con el servidor");
    }

    throw error;
  }
}