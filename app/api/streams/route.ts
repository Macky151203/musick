import { NextResponse,NextRequest } from "next/server";
import {prismaClient} from '@/app/lib/db'
//@ts-ignore
import youtubesearchapi from "youtube-search-api";




export async function POST(req:NextRequest){
 
  try{
    const data=await req.json()
    //try adding regex'
    const isyt=data.url.includes("youtube")
    if(!isyt){
      return NextResponse.json({msg:"Wrong url format"})
    }
    const extractedId=data.url.split("?v=")[1]
    const details=await youtubesearchapi.GetVideoDetails(extractedId)
    // console.log(details)
    const title=details.title
    const description=details.description
    const stream=await prismaClient.stream.create({
      data:{
        userId:data.creatorId,
        url:data.url,
        title:title,
        description:description,
        extractedId,
        type:"Youtube"
      }
    })
    return NextResponse.json({msg:"STream created successfully",stream:stream})

  }catch(e){
    
    return NextResponse.json({Msg:"Error in schea validation"})
  }

}


export async function GET(req:NextRequest) {
  const creatorId=req.nextUrl.searchParams.get('creatorId')
  //console.log(creatorId)
  const streamdata=await prismaClient.stream.findMany({
    where:{
      userId:creatorId??""
    }
  })
  return NextResponse.json({streamdata})
}