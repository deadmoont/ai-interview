import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'

function InterviewItemCard({interview}) {
    const router=useRouter();

    const onStart=()=>{
        router.push('/dashboard/interview/'+interview?.mockId);
    }

    const onFeedback=()=>{
        router.push('/dashboard/interview/'+interview?.mockId+'/feedback');
    }
  return (
    <div className='border shadow-sm rounded-lg p-3'>
        <h2 className='font-bold text-blue-800'>{interview?.jobPosition}</h2>
        <h2 className='text-sm text-gray-600'>{interview?.jobExperience} Years of Experience</h2>
        <h2 className='text-xs text-gray-500'>
        Created At: {new Date(interview.createdAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })}
        </h2>
        <div className='flex justify-between mt-2 gap-5'>
            <Button onClick={onFeedback} size="sm" variant="outline" className="flex-1">Feedback</Button>
            <Button onClick={onStart} size="sm" className="flex-1">Start</Button>
        </div>


    </div>
  )
}

export default InterviewItemCard