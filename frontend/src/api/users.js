const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
export const fetchUserTranscripts = async (userId, userToken) => {
  const res = await fetch(`${API_URL}/api/users/${userId}/transcripts`, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });

  if (!res.ok) {
    if (res.status === 403) {
      throw new Error("Invalid/expired token");
    } else {
      throw new Error("Fialed to fetch user transcripts");
    }
  }

  return await res.json();
};

export const createUser = async (email, username, password) => {
  const res = await fetch(`${API_URL}/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg);
  }
};
