"use client"
import { Button } from '@/components/ui/button'
import { db } from '@/utils/db';
import { getInterviewQA } from '@/utils/GeminiAiModal';
import { UserAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { Mic } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import useSpeechToText from 'react-hook-speech-to-text';
import Webcam from 'react-webcam'
import { toast } from 'sonner';

function RecordAnswerSection({mockInterviewQuestion,activeQuestionIndex,interviewData}) {
    const [userAnswer,setuserAnswer]=useState('');
    const {user}=useUser();
    const [loading,setLoading]=useState(false);
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

  useEffect(()=>{
    results.map((result)=>(
        setuserAnswer(prevAns=>prevAns+result?.transcript)
    ))
  },[results])

  useEffect(()=>{
    if(!isRecording && userAnswer.length>10){
        UpdateUserAnswer();
    }
  },[userAnswer])

  const StartStopRecording=async()=>{
    if(isRecording){
        stopSpeechToText();
        // if(userAnswer?.length<10){
        //     setLoading(false);
        //     console.log('hello');
        //     alert("Error While saving your answer,Please Record Again");
        //     return;
        // }
    }
    else{
        startSpeechToText();
    }
  }

  const UpdateUserAnswer=async()=>{
    console.log(userAnswer);
    setLoading(true);
    const feedbackPrompt="Question"+mockInterviewQuestion[activeQuestionIndex]?.question+", User answer :"+userAnswer+",Depends on question and user answer for given interview question"+"please give us rating for the answer and feedback as area of improvement if any "+"in just 3 to 5 lines to improve it in JSON format with rating field and feedback field and the feedback should contain the improvement area";

    const result=await getInterviewQA(feedbackPrompt);
    const mockJsonResp = result
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();
    const jsonFeedbackResp = JSON.parse(mockJsonResp);
    console.log(jsonFeedbackResp); // ✅ Clean JSON: { rating: ..., feedback: ... }
    
    const resp=await db.insert(UserAnswer)
    .values({
        mockIdRef:interviewData?.mockId,
        question:mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAns:mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAns:userAnswer,
        feedback:jsonFeedbackResp?.feedback,
        rating:jsonFeedbackResp?.rating,
        userEmail:user?.primaryEmailAddress?.emailAddress,
        createdAt:moment().toDate()
    });
    if(resp){
        toast.success("User Ans Recorded Successfully")
        setuserAnswer('');
        setResults([]);
    }
    setResults([]);
    setLoading(false);
  }

  return (
    <div className='flex items-center justify-center flex-col'>
        <div className='flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5'>
            <Image src={'/webcam.png'} width={200} height={200} className='absolute'/>
            <Webcam
            mirrored={true}
            style={{
                height:300,
                width:'100%',
                zIndex:10,

            }}
            />
        </div>
        <Button 
        disabled={loading}
        variant="outline" className="my-10"
        onClick={StartStopRecording}
        >
            {isRecording?
            <h2 className='text-red-600 flex gap-2'>
                <Mic/>Stop Recording
            </h2>
            :
            'Record Answer'}
            </Button>

            {/* <Button onClick={()=>console.log(userAnswer)}>Show user Ans</Button> */}

        {/* <h1>Recording: {isRecording.toString()}</h1>
      <button onClick={isRecording ? stopSpeechToText : startSpeechToText}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <ul>
        {results.map((result) => (
          <li key={result.timestamp}>{result.transcript}</li>
        ))}
        {interimResult && <li>{interimResult}</li>}
      </ul> */}
    </div>
  )
}

export default RecordAnswerSection