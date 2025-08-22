import { RouterProvider } from "@tanstack/react-router";
import { TokenProvider, useToken } from "./context/TokenContext";
import { RecordingAttemptCountContextProvider } from "./context/RecordingAttemptContext";
import { router } from "./router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

function InnerApp() {
  const { token } = useToken();
  return <RouterProvider router={router} context={{ token }} />;
}

function App() {
  return (
    <TokenProvider>
      <RecordingAttemptCountContextProvider>
        <QueryClientProvider client={queryClient}>
          <InnerApp />
        </QueryClientProvider>
      </RecordingAttemptCountContextProvider>
    </TokenProvider>
  );
}

export default App;
