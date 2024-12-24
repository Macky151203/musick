'use client'
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button"


export default function Appbar(){
  const session=useSession()
  
  return (
    <>
    <div className="flex justify-between p-4 mb-4 shadow-md">
    <h1 className="md:text-4xl text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Musick🎧</h1>      
    <div>{!session.data?.user?<Button className="rounded-lg bg-blue-600 px-4" onClick={()=>signIn()}>SignIn</Button>:<Button className="rounded-lg bg-red-600 px-4 " onClick={()=>signOut()}>SignOut</Button>}</div>
      
    </div>
    </> 
  )
}