import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
  const data=await req.json();
  console.log(data.streamId)
  try{
    //for unique constraint , deleting upvotes first for a stream
    await prismaClient.upvote.deleteMany({
      where:{
        streamId:data.streamId,
      }
    })
    await prismaClient.stream.delete({
      where:{
        id:data.streamId
      }
    })
    return NextResponse.json({msg:"deleted"})
  }
  catch(e){
    // console.log(e)
    return NextResponse.json({error:e})
  }
}