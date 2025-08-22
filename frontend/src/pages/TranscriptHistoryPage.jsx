import Navbar from "../components/Navbar";
import UserInfo from "../components/UserInfo";
import UserTranscripts from "../components/UserTranscripts";
import { useQuery } from "@tanstack/react-query";
import { useToken } from "../context/TokenContext";
import { getUserByToken } from "../api/auth";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

const TranscriptHistoryPage = () => {
  const { token } = useToken();
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["getUserByToken", token],
    queryFn: () => getUserByToken(token),
    retry: 0,
  });

  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex flex-col h-dvh w-dvw justify-start">
        <Navbar />
        <div className="my-auto text-center">
          <h1>Loading your profile....</h1>
        </div>
      </div>
    );
  }

  if (isError) {
    if (
      error.message === "Token missing" ||
      error.message === "Invalid/expired token" ||
      error.message == "No auth headers"
    ) {
      navigate({ to: "/login" });
    }

    return (
      <div className="flex flex-col h-dvh w-dvw justify-start">
        <Navbar />
        <div className="my-auto text-center">
          <h1>
            Error fetching your profile. Error: {error.message}. Please try
            again later.{" "}
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="h-dvh w-dvw flex flex-col">
      <Navbar />
      <main className="m-auto flex flex-col md:flex-row items-center gap-4">
        <UserInfo user={data.user} />
        <UserTranscripts userId={data.user.id} />
      </main>
    </div>
  );
};

export default TranscriptHistoryPage;
