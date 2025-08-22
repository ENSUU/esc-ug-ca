import { createFileRoute, redirect } from "@tanstack/react-router";
import TranscriptHistoryPage from "../pages/TranscriptHistoryPage";

export const Route = createFileRoute("/transcript-history")({
  beforeLoad: async ({ context }) => {
    if (context.token == null) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: TranscriptHistoryPage,
});
