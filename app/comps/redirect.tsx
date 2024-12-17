'use client'
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
export default function Redirect(){
  const router=useRouter()
  const session=useSession()
  useEffect(()=>{
    if(session.data?.user){
      router.push('/dashboard')
    }
  },[session])
  return null
}``