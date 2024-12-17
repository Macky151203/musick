import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prismaClient } from "@/app/lib/db";
export async function GET(req:NextRequest){
   const session=await getServerSession()
  console.log(session?.user?.email)
  const user=await prismaClient.user.findFirst({
    where:{
      email:session?.user?.email??""
    }
  })
  if(user){
    console.log("creatorId-",user.id)
  }
  else{
    console.log("nooooo")                                           
  }
  return NextResponse.json({creatorId:user?.id})

}