"use client"

import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useParams } from 'next/navigation';

function StartInterview() {

    const params = useParams();

    const [interviewData, setInterviewData] = useState(null);
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

    useEffect(() => {
        if (params?.interviewId) {
            getInterviewDetails();
        }
    }, [params]);

    const getInterviewDetails = async () => {
        try {
            const result = await db
                .select()
                .from(MockInterview)
                .where(eq(MockInterview.mockId, params.interviewId));

            if (!result.length) return;

            const row = result[0];
            setInterviewData(row);

            console.log("Raw DB Response:", row.jsonMockResp);

            const cleanedResponse = row.jsonMockResp
                ?.replace(/```json/g, "")
                ?.replace(/```/g, "")
                ?.trim();

            const parsedData = JSON.parse(cleanedResponse);

            console.log("Parsed Data:", parsedData);
            console.log("Questions:", parsedData?.interview_questions);

            setMockInterviewQuestion(
                parsedData?.interview_questions || []
            );

        } catch (error) {
            console.error("Error parsing interview questions:", error);
            setMockInterviewQuestion([]);
        }
    };

    return (
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>

                <QuestionsSection
                    mockInterviewQuestion={mockInterviewQuestion}
                    activeQuestionIndex={activeQuestionIndex}
                />

                <RecordAnswerSection
                    mockInterviewQuestion={mockInterviewQuestion}
                    activeQuestionIndex={activeQuestionIndex}
                    interviewData={interviewData}
                />
            </div>

            <div className='flex justify-end gap-6 mt-5'>

                {activeQuestionIndex > 0 && (
                    <Button
                        onClick={() =>
                            setActiveQuestionIndex(activeQuestionIndex - 1)
                        }
                    >
                        Previous Question
                    </Button>
                )}

                {activeQuestionIndex <
                    mockInterviewQuestion.length - 1 && (
                    <Button
                        onClick={() =>
                            setActiveQuestionIndex(activeQuestionIndex + 1)
                        }
                    >
                        Next Question
                    </Button>
                )}

                {activeQuestionIndex ===
                    mockInterviewQuestion.length - 1 &&
                    mockInterviewQuestion.length > 0 && (
                        <Link
                            href={`/dashboard/interview/${interviewData?.mockId}/feedback`}
                        >
                            <Button>
                                End Interview
                            </Button>
                        </Link>
                    )}
            </div>
        </div>
    );
}

export default StartInterview;