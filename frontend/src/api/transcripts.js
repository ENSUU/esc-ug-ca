const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
export const fetchGeneratedTranscript = async (audioBlob, userToken) => {
  let formData = new FormData();
  formData.append("audio", audioBlob, "recording.wav");
  formData.append("userToken", userToken);

  const res = await fetch(`${API_URL}/api/transcripts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Upload failed.");
  }

  return await res.json();
};

export const deleteTranscriptById = async (transcriptId, userToken) => {
  const res = await fetch(`${API_URL}/api/transcripts/${transcriptId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to delete transcript with id: ${transcriptId}`);
  }

  return await res.json();
};

export const updateTranscriptById = async (
  transcriptId,
  updatedText,
  userToken,
) => {
  const res = await fetch(`${API_URL}/api/transcripts/${transcriptId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    },
    body: JSON.stringify({ text: updatedText }),
  });

  if (!res.ok) {
    throw new Error(`Failed to update transcript with id: ${transcriptId}`);
  }

  return await res.json();
};
