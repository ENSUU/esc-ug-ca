const API_URL = import.meta.env.VITE_API_URL;
export const loginUser = async (usernameOrEmail, password) => {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usernameOrEmail, password }),
  });

  if (!res.ok) {
    if (res.status == 401) {
      throw new Error("Incorrect username/password");
    } else if (res.status == 500) {
      throw new Error("Somthing went wrong. Please try again");
    }
  }

  return await res.json();
};

export const getUserByToken = async (token) => {
  const res = await fetch(`${API_URL}/api/auth/${token}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      const data = await res.json();
      throw new Error(data.error);
    } else {
      throw new Error("Failed to get user by token. ");
    }
  }

  return await res.json();
};
