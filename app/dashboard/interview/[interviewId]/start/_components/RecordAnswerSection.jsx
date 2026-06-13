"use client";

import { Button } from '@/components/ui/button';
import { db } from '@/utils/db';
import { getInterviewQA } from '@/utils/GeminiAiModal';
import { UserAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { Mic } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { toast } from 'sonner';

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

function RecordAnswerSection({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
}) {
  const { user } = useUser();

  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    setUserAnswer(transcript);
  }, [transcript]);

  useEffect(() => {
    if (!listening && userAnswer.length > 10) {
      UpdateUserAnswer();
    }
  }, [listening]);

  const StartStopRecording = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      setUserAnswer("");

      SpeechRecognition.startListening({
        continuous: true,
        language: "en-US",
      });
    }
  };

  const UpdateUserAnswer = async () => {
    try {
      setLoading(true);

      const feedbackPrompt =
        "Question: " +
        mockInterviewQuestion?.[activeQuestionIndex]?.question +
        ", User Answer: " +
        userAnswer +
        ". Based on the question and answer, provide rating and feedback in JSON format with fields rating and feedback. Feedback should be 3-5 lines and contain improvement suggestions.";

      const result = await getInterviewQA(feedbackPrompt);

      const mockJsonResp = result
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const jsonFeedbackResp = JSON.parse(mockJsonResp);

      const resp = await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question:
          mockInterviewQuestion?.[activeQuestionIndex]?.question,
        correctAns:
          mockInterviewQuestion?.[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: jsonFeedbackResp?.feedback,
        rating: jsonFeedbackResp?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().toDate(),
      });

      if (resp) {
        toast.success("User Answer Recorded Successfully");
      }

      resetTranscript();
      setUserAnswer("");

    } catch (error) {
      console.error(error);
      toast.error("Failed to save answer");
    } finally {
      setLoading(false);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="text-red-500">
        Browser does not support speech recognition.
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center flex-col">

      <div className="flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5">
        <Image
          src={"/webcam.png"}
          width={200}
          height={200}
          className="absolute"
          alt="webcam"
        />

        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: "100%",
            zIndex: 10,
          }}
        />
      </div>
      <Button
        disabled={loading}
        variant="outline"
        className="my-10"
        onClick={StartStopRecording}
      >
        {listening ? (
          <h2 className="text-red-600 flex gap-2">
            <Mic />
            Stop Recording
          </h2>
        ) : (
          "Record Answer"
        )}
      </Button>

      {listening && (
        <div className="w-full max-w-2xl p-4 border rounded-lg bg-yellow-50">
          <h2 className="font-semibold text-yellow-700 mb-2">
            Listening...
          </h2>

          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
}

export default RecordAnswerSection;
