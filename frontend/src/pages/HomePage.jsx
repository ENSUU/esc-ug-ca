import Navbar from "../components/Navbar";
import { useState, useRef, useEffect } from "react";
import { MediaRecorder, register } from "extendable-media-recorder";
import { connect, record } from "extendable-media-recorder-wav-encoder";
import { useMutation } from "@tanstack/react-query";
import { fetchGeneratedTranscript } from "../api/transcripts";
import { useToken } from "../context/TokenContext";
import { useRecordingAttemptCount } from "../context/RecordingAttemptContext";
import { useNavigate } from "@tanstack/react-router";

function HomePage() {
  const [generatedTranscript, setGeneratedTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const { token } = useToken();
  const { recordingAttemptCount, increment } = useRecordingAttemptCount();

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (blob) => fetchGeneratedTranscript(blob, token),
    onSuccess: (data) => {
      setGeneratedTranscript(data.text);
      increment();
    },
    onError: (error) => {
      if (error.message === "Invalid/expired token") {
        navigate({ to: "/login" });
      } else if (
        error.message ===
        "Something went wrong trying to generate your transcript. Please try again."
      ) {
        setErrorMessage(error.message);
      }
    },
  });

  useEffect(() => {}, [isRecording]);

  const startRecording = async () => {
    try {
      // Only required for the first recording attempt.
      if (recordingAttemptCount == 1) {
        await register(await connect());
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Resample audio to record in 16 kHz
      const audioContext = new AudioContext({ sampleRate: 16000 });
      const mediaStreamAudioSourceNode = new MediaStreamAudioSourceNode(
        audioContext,
        { mediaStream: stream },
      );
      const mediaStreamAudioDestinationNode =
        new MediaStreamAudioDestinationNode(audioContext);
      mediaStreamAudioSourceNode.connect(mediaStreamAudioDestinationNode);

      mediaRecorderRef.current = new MediaRecorder(
        mediaStreamAudioDestinationNode.stream,
        {
          mimeType: "audio/wav",
        },
      );
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunksRef.current, {
          type: "audio/wav",
        });

        const audioURL = URL.createObjectURL(blob);
        mutation.mutate(blob, token);
        setAudioURL(audioURL);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error(err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    setGeneratedTranscript("Getting your transcript...");
  };

  const restartRecording = () => {
    setGeneratedTranscript("");
    setAudioURL("");
    mediaRecorderRef.current = null;
    chunksRef.current = [];
  };

  const getButtonColor = () => {
    if (generatedTranscript == "") {
      return "bg-green-500";
    } else {
      return "bg-gray-300";
    }
  };

  return (
    <div className="h-dvh w-dvw flex flex-col">
      <Navbar />
      <main className="w-full m-auto flex flex-col justify-center items-center gap-8">
        {generatedTranscript != "" && (
          <div
            id="generated-text-container"
            className="w-[450px] p-2 text-center"
          >
            <h2 className="text-xl">You said: </h2>
            <h1 className="mx-auto text-3xl font-bold">
              {generatedTranscript}
            </h1>
          </div>
        )}
        {errorMessage != "" && (
          <div id="error-text-container">
            <h1 className="text-center mx-auto text-3xl font-bold p-2">
              {errorMessage}
            </h1>
          </div>
        )}
        {audioURL && (
          <div id="recorded-audio-container">
            <h2 className="text-xl">Recording: </h2>
            <audio src={audioURL} controls />
          </div>
        )}
        <div id="btn-controls" className="md:w-[500px] flex flex-col gap-4 p-4">
          {!isRecording && generatedTranscript === "" ? (
            <button
              onClick={startRecording}
              className={`w-full m-auto px-8 py-2 font-bold rounded-md text-white hover:scale-[1.1] ${getButtonColor()}`}
            >
              Start Recording
            </button>
          ) : isRecording ? (
            <button
              onClick={stopRecording}
              className="w-full m-auto px-8 py-2 font-bold rounded-md bg-red-400 text-white hover:scale-[1.1]"
            >
              Stop Recording
            </button>
          ) : (
            <button
              onClick={restartRecording}
              className="w-full m-auto px-8 py-2 font-bold rounded-md bg-green-400 text-white hover:scale-[1.1]"
            >
              Start New Recording
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

export default HomePage;
