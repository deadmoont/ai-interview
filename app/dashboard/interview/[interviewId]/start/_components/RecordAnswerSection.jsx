"use client"
import { Button } from '@/components/ui/button'
import { db } from '@/utils/db';
import { getInterviewQA } from '@/utils/GeminiAiModal';
import { UserAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { Mic } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import useSpeechToText from 'react-hook-speech-to-text';
import Webcam from 'react-webcam';
import { toast } from 'sonner';

function RecordAnswerSection({ questionChain, setQuestionChain, activeQuestionIndex, setActiveQuestionIndex, interviewData }) {
  const [userAnswer, setUserAnswer] = useState('');
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

  useEffect(() => {
    results.map((result) => {
      setUserAnswer(prev => prev + result?.transcript);
    });
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      handleAnswerSubmit();
    }
  }, [userAnswer]);

  const StartStopRecording = () => {
    if (isRecording) stopSpeechToText();
    else startSpeechToText();
  };

  const handleAnswerSubmit = async () => {
    setLoading(true);
    const currentQuestion = questionChain[activeQuestionIndex];

    // 1. Get feedback
    const feedbackPrompt = `Question: ${currentQuestion.question}\nUser answer: ${userAnswer}\nGive rating (out of 5) and short feedback to help user improve in JSON format with 'rating' and 'feedback' fields.`;
    const feedbackRaw = await getInterviewQA(feedbackPrompt);
    const feedbackClean = feedbackRaw.replace(/```json|```/g, '').trim();
    const feedbackObj = JSON.parse(feedbackClean);

    // 2. Save to DB
    await db.insert(UserAnswer).values({
      mockIdRef: interviewData?.mockId,
      question: currentQuestion.question,
      correctAns: currentQuestion.answer ?? '',
      userAns: userAnswer,
      feedback: feedbackObj.feedback,
      rating: feedbackObj.rating,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      createdAt: moment().toDate()
    });

    toast.success('Answer Saved & Reviewed');

    // 3. Ask follow-up if depth < 2
    if ((currentQuestion.followUpDepth ?? 0) < 2) {
      const followPrompt = `User said: "${userAnswer}". Ask a follow-up interview question to clarify or challenge their understanding. Return only the question string.`;
      const followResp = await getInterviewQA(followPrompt);
      const followUpQuestion = followResp.replace(/["`\n]/g, '').trim();

      const newQ = {
        question: followUpQuestion,
        answer: '',
        followUpDepth: (currentQuestion.followUpDepth ?? 0) + 1
      };

      setQuestionChain(prev => {
        const updated = [...prev];
        updated[activeQuestionIndex] = newQ;
        return updated;
      });
    } else {
      // Move to next original question if no more follow-ups
      setActiveQuestionIndex(prev => prev + 1);
    }

    // 4. Cleanup
    setUserAnswer('');
    setResults([]);
    setLoading(false);
  };

  return (
    <div className='flex items-center justify-center flex-col'>
      <div className='flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5'>
        <Image src={'/webcam.png'} width={200} height={200} className='absolute' />
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: '100%',
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
        {isRecording ?
          <h2 className='text-red-600 flex gap-2'>
            <Mic />Stop Recording
          </h2>
          :
          'Record Answer'}
      </Button>
    </div>
  );
}

export default RecordAnswerSection;
