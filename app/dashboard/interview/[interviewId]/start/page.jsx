"use client"
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';

function StartInterview({params}) {

    const [interviewData,setInterviewData]=useState();
    const [mockInterviewQuestion,setMockInterviewQuestion]= useState();
    const [activeQuestionIndex,setActiveQuestionIndex] =useState(0)

    useEffect(()=>{
        console.log(params.interviewId);
        getInterviewDetails();
    },[])

    // used to get interview details using MockId
    const getInterviewDetails = async () => {
    const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId))

    if (!result.length) return
    const row = result[0]
    setInterviewData(row)

    const pgArrayLiteral = row.jsonMockResp.trim()
    const jsonArrayString  = pgArrayLiteral
        .replace(/^\{/, '[')   // leading { → [
        .replace(/\}$/, ']')   // trailing } → ]

    // 3) now this is a JSON array of strings
    const miniArray = JSON.parse(jsonArrayString)

    // 4) parse each inner string into an object
    const jsonMockResp = miniArray.map(s => JSON.parse(s))
    console.log(jsonMockResp)

    setMockInterviewQuestion(jsonMockResp)

    }

return (
    <div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
            {/* Questions */}
            <QuestionsSection mockInterviewQuestion={mockInterviewQuestion}
            activeQuestionIndex={activeQuestionIndex}
            />
            {/* vidio/Audio recording */}
            <RecordAnswerSection/>
        </div>
    </div>
)
}

export default StartInterview