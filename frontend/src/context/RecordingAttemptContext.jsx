import { createContext, useContext, useState } from "react";

export const RecordingAttemptCountContext = createContext();

export const RecordingAttemptCountContextProvider = ({ children }) => {
  const [recordingAttemptCount, setRecordingAttemptCount] = useState(1);

  const increment = () => {
    setRecordingAttemptCount((prev) => prev + 1);
  };

  return (
    <RecordingAttemptCountContext.Provider
      value={{ recordingAttemptCount, increment }}
    >
      {children}
    </RecordingAttemptCountContext.Provider>
  );
};

export const useRecordingAttemptCount = () =>
  useContext(RecordingAttemptCountContext);
