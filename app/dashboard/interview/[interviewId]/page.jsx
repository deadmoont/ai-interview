"use client"
import { Button } from '@/components/ui/button';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam';
import { eq } from 'drizzle-orm';


function Interview({params}) {

    const [interviewData,setInterviewData]=useState();
    const [webCamEnabled,setwebCamEnabled]=useState(false);

    useEffect(()=>{
        console.log(params.interviewId);
        getInterviewDetails();
    },[])

    // used to get interview details using MockId
    const getInterviewDetails= async ()=>{
        const result=await db.select().from(MockInterview)
        .where(eq(MockInterview.mockId,params.interviewId))
        console.log(result[0])

        setInterviewData(result[0]);
    }

  return (
    <div className='my-10 '>
        <h2 className='font-bold text-2xl'>Let's Get Started</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
           
        <div className='flex flex-col my-5 gap-5'>
            <div className='flex flex-col p-5 rounded-lg border'>
                {interviewData && (
            <h2 className='p-2 text-lg'>
                <strong>Job Role/Job Position: </strong>{interviewData.jobPosition}
            </h2>
            )}
            {interviewData && (
            <h2 className='p-2 text-lg'>
                <strong>Job Description/Tech Stack: </strong>{interviewData.jobDesc}
            </h2>
            )}
            {interviewData && (
            <h2 className='p-2 text-lg'>
                <strong>Years of Experience: </strong>{interviewData.jobExperience}
            </h2>
            )}
            </div>
            <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100'>
                <h2 className='flex gap-2 items-center text-yellow-500'><Lightbulb/><strong>Information</strong></h2>
                <h2 className='mt-3 text-yellow-500'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
            </div>

        </div>

        <div>
            {webCamEnabled? <Webcam
                onUserMedia={()=>setwebCamEnabled(true)}
                onUserMediaError={()=>setwebCamEnabled(false)}
                mirrored={true}
                style={{
                    height:300,
                    width:300
                }}
            />
            :
            <>
            <WebcamIcon className='h-72 w-full my-7 p-20 bg-secondary rounded-lg border'/>
            <Button onClick={()=>setwebCamEnabled(true)} className='w-full'>  Enable Web Cam and Microphone </Button>
            </>
            }
            <div className='mt-10 flex justify-end items-end'>
            <Button className='bg-blue-500'>Start Interview</Button>
            </div>
        </div>
        

        </div>

        
        
    </div>
  )
}

export default Interview    