'use client'
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button"


export default function Appbar(){
  const session=useSession()
  
  return (
    <>
    <div className="flex justify-between p-8">
    <h1 className="text-2xl font-bold">StreamBeats</h1>      
    <div>{!session.data?.user?<Button className="rounded-lg bg-blue-600 px-4 p-2" onClick={()=>signIn()}>SignIn</Button>:<Button className="rounded-lg bg-red-600 px-4 p-2" onClick={()=>signOut()}>SignOut</Button>}</div>
      
    </div>
    </>
  )
}