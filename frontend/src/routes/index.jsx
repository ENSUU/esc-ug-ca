import { createFileRoute, redirect } from "@tanstack/react-router";
import HomePage from "../pages/HomePage";

export const Route = createFileRoute("/")({
  beforeLoad: async ({ context }) => {
    if (context.token == null) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: HomePage,
});
