"use client"
import React, { useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { getInterviewQA } from '@/utils/GeminiAiModal'
import { LoaderCircle } from 'lucide-react'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { useRouter } from 'next/navigation'

function AddNewInterview() {
    const [openDialog,setopenDialog]=useState(false)
    const [jobPosition,setJobPosition]=useState();
    const [jobDesc,setJobDesc]=useState();
    const [jobExperience,setJobExperience]=useState();
    const [loading,setLoading]=useState(false)
    const [jsonResponse , setJsonResponse]=useState([]);
    const router=useRouter();
    const {user}= useUser();


    const onSubmit= async(e)=>{
        setLoading(true)
        e.preventDefault()
        console.log(jobPosition,jobDesc,jobExperience);

        const InputPrompt="JobPosition: "+jobPosition+" , Job Desc: "+jobDesc+" Years of Experience: "+jobExperience+" depends upon these information give me "+process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT+" interview ques and their ans in json format"

        const result=await getInterviewQA(InputPrompt);

        if (!result) {
        console.error("Empty or invalid response from Gemini");
        return;
        }
        console.log(result);
        setJsonResponse(result);
        if(result){
            const resp=await db.insert(MockInterview)
            .values({
                mockId:uuidv4(),
                jsonMockResp:result,
                jobPosition:jobPosition,
                jobDesc:jobDesc,
                jobExperience:jobExperience,
                createdBy:user?.primaryEmailAddress?.emailAddress,
                createdAt: moment().toDate()
            }).returning({mockId:MockInterview.mockId})

            console.log("Inserted ID:",resp);
            if(resp){
                setopenDialog(false);
                router.push('/dashboard/interview/'+resp[0]?.mockId)
            }
        }
        else{
            console.log("ERROR");
        }

        setLoading(false)

    }

  return (
    <div>
        <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'>
            <h2 className='text-lg text-center'
                onClick={()=>setopenDialog(true)}
            >+ Add new </h2>
        </div>
        <Dialog open={openDialog}>
        <DialogContent className='max-w-2xl'>
            <DialogHeader>
            <DialogTitle className='text-2xl'>Tell us more about your Job Interview</DialogTitle>
            <DialogDescription>
                <form onSubmit={onSubmit}>
                    <div>
                    <h2>Add details about your job position,role , Job description and year of experience.</h2>
                    <div className='mt-7 my-3'>
                        <label>Job Role/Job Position</label>
                        <Input placeholder="Ex. Full Stack Developer" required
                        onChange={(event)=>setJobPosition(event.target.value)}
                        />
                    </div>
                    <div className='my-3'>  
                        <label>Job Description/Tech Stack(In short)</label>
                        <Textarea placeholder="Ex. React , Angular , NodeJS etc." required
                        onChange={(event)=>setJobDesc(event.target.value)}
                        />
                    </div>
                    <div className='my-3'>
                        <label>Years of Experience</label>
                        <Input placeholder="Ex. 2" type="number" max="50" required
                        onChange={(event)=>setJobExperience(event.target.value)}
                        />
                    </div>
                </div>
                <div className='flex gap-5 justify-end'>
                    <Button type="button" variant="ghost" onClick={()=>setopenDialog(false)}>Cancel</Button>
                    <Button type="submit" disabled={loading}>
                        {loading?
                        <>
                        <LoaderCircle className='animate-spin'/>'Generating From AI'
                        </>:'Start Interview'
                        }</Button>
                </div>
                </form>
            </DialogDescription>
            </DialogHeader>
        </DialogContent>
        </Dialog>
    </div>
    
  )
}

export default AddNewInterview