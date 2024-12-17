import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest,NextResponse } from "next/server";




export async function POST(req:NextRequest){
  const session=await getServerSession();
  if(!session?.user?.email){
    return NextResponse.json({msg:"not authenticated"})
  }
  const user=await prismaClient.user.findFirst({
    where:{
      email:session.user.email
    }
  })
  try{
    const data=await req.json()
    if (!user?.id) {
      return NextResponse.json({msg: "user not found"}, {status: 400})
    }
    await prismaClient.upvote.create({
      data:{
        userId: user.id,
        streamId: data.streamId
      }
    })
    return NextResponse.json({msg:"Upvoted added"})
    
  }catch(e){
    console.log("error during upvote")
  }

}