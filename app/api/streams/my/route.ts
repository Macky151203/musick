import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest){
  const session=await getServerSession()
  // console.log("session-",session)
  const user=await prismaClient.user.findFirst({
    where:{
      email:session?.user?.email??""
    }
  })
  // console.log(user)
  if(!user){
    return NextResponse.json({msg:"not allowed, you are unauthenticated"})
  }
  const streams=await prismaClient.stream.findMany({
    where:{
      userId:user.id
    },
    include:{
      _count:{
        select:{
          upvotes:true
        }
      }
    }
  })
  return NextResponse.json({
    streams:streams.map(({_count,...rest})=>({
      ...rest,
      upvotes:_count.upvotes
    }))
  })
}