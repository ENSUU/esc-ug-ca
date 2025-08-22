import { useQuery } from "@tanstack/react-query";
import { fetchUserTranscripts } from "../api/users";
import TranscriptTab from "./TranscriptTab";
import { useToken } from "../context/TokenContext";
import { useNavigate } from "@tanstack/react-router";

const UserTranscripts = ({ userId }) => {
  const { token } = useToken();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getUserTranscripts"],
    queryFn: () => fetchUserTranscripts(userId, token),
  });

  if (isLoading) {
    return (
      <div>
        <h1>Loading transcripts...</h1>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <h1>Error loading transcripts. Please try again later.</h1>
      </div>
    );
  }

  if (data.transcripts.length == 0) {
    return (
      <div>
        <h1>No transcripts found.</h1>
      </div>
    );
  }

  return (
    <div id="user-transcripts-container" className="p-2 md:p-0">
      {data.transcripts.map((transcript) => {
        return (
          <TranscriptTab
            key={transcript.id}
            id={transcript.id}
            text={transcript.generated_text}
          />
        );
      })}
    </div>
  );
};

export default UserTranscripts;
