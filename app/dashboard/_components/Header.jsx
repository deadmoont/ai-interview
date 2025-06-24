"use client"
import React, { useEffect } from 'react'
import Image from "next/image";
import { UserButton } from '@clerk/nextjs';
import { usePathname, useRouter } from 'next/navigation';

function Header() {
   const router=useRouter();
   const path=usePathname(); 
   useEffect(()=>{
    console.log(path);
   },[path])

   const onUpgrade=()=>{
        router.push('/dashboard/upgrade');
   }

   const onDashboard=()=>{
    router.push('/dashboard');
   }

   const onHow=()=>{
    router.push('/dashboard/how');
   }

  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-md'>
        <Image src={'/logo.svg'} width={160} height={100} alt='logo' />
        <ul className='hidden md:flex gap-6'>
            <li onClick={onDashboard} className={`hover:text-primary hover:font-bold transition-all cursor-pointer
                ${path=='/dashboard' && 'text-primary font-bold'}
            `}>Dashboard</li>
            {/* <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
                ${path=='/dashboard/question' && 'text-primary font-bold'}
            `}>Questions</li> */}
            <li onClick={onUpgrade} className={`hover:text-primary hover:font-bold transition-all cursor-pointer
                ${path=='/dashboard/upgrade' && 'text-primary font-bold'}
            `}>Upgrade</li>
            <li onClick={onHow} className={`hover:text-primary hover:font-bold transition-all cursor-pointer
                ${path=='/dashboard/how' && 'text-primary font-bold'}
            `}>How it Works?</li>
        </ul>
        <UserButton/>
    </div>
  )
}

export default Header