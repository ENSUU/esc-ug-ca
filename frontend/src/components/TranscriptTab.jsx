import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteTranscriptById, updateTranscriptById } from "../api/transcripts";
import { useToken } from "../context/TokenContext";

const TranscriptTab = ({ id, text }) => {
  const [isTextboxVisible, setIsTextboxVisible] = useState(false);
  const [updatedTranscriptText, setUpdatedTranscriptText] = useState(text);
  const { token } = useToken();

  const queryClient = useQueryClient();
  const deleteTranscriptMutation = useMutation({
    mutationFn: () => deleteTranscriptById(id, token),
    onSuccess: () => {
      console.log("Successfully deleted transcript with id " + id);
      queryClient.invalidateQueries({ queryKey: ["getUserTranscripts"] });
    },
  });

  const updateTranscriptMutation = useMutation({
    mutationFn: (id) => updateTranscriptById(id, updatedTranscriptText, token),
    onSuccess: () => {
      console.log("Successfully updated transcript with id " + id);
      queryClient.invalidateQueries({ queryKey: ["getUserTranscripts"] });
      setIsTextboxVisible((prev) => !prev);
    },
  });

  const handleDelete = (e) => {
    e.preventDefault();
    deleteTranscriptMutation.mutate(id);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updateTranscriptMutation.mutate(id);
  };

  const toggleTextbox = (e) => {
    e.preventDefault();
    setIsTextboxVisible((prev) => !prev);
  };

  return (
    <div className="flex justify-end items-center gap-2 p-2 md:gap-8 md:p-4 my-4 rounded-md shadow-sm md:w-[600px]">
      <div className="flex gap-4 items-center mr-auto">
        <h1 className="font-bold">ID: {id}</h1>
        {!isTextboxVisible ? (
          <p> {text}</p>
        ) : (
          <input
            type="text"
            className="border-black !border-2"
            value={updatedTranscriptText}
            onChange={(e) => setUpdatedTranscriptText(e.target.value)}
          />
        )}
      </div>
      <div className="flex gap-4 items-center">
        {!isTextboxVisible ? (
          <>
            <button className="hover:font-bold" onClick={toggleTextbox}>
              Edit
            </button>
            <button className="hover:font-bold" onClick={handleDelete}>
              Delete
            </button>
          </>
        ) : (
          <>
            <button className="hover:font-bold" onClick={handleUpdate}>
              Save
            </button>
            <button
              className="hover:font-bold"
              onClick={() => {
                setIsTextboxVisible((prev) => !prev);
                setUpdatedTranscriptText(text);
              }}
            >
              Discard
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TranscriptTab;
