'use client'
//prima client issue validation problem
//make new sharing page, handle upvotes and when the song is done playing then delete it from db as well while popping from queue
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown, SkipForward, Share2 } from 'lucide-react'


import { useToast } from "@/hooks/use-toast"
import { useSession } from 'next-auth/react'

const initialQueue: any[] | (() => any[]) = [
  //{ id: 1, title: 'Song 1', description: 'Artist 1', upvotes: 5, url: 'paWE-GvDO1c' },
  // { id: 2, title: 'Song 2', description: 'Artist 2', upvotes: 3, url: 'dQw4w9WgXcQ' },
  // { id: 3, title: 'Song 3', description: 'Artist 3', upvotes: 1, url: 'dQw4w9WgXcQ' },
]

export default function MusicVotingApp() {
  const [queue, setQueue] = useState(initialQueue)
  const [newSongUrl, setNewSongUrl] = useState('')
  const [currentSong, setCurrentSong] = useState(queue[0])
  const { toast } = useToast()
  const session=useSession()
  const [isLoading, setIsLoading] = useState(false)
  const showtoast=()=>{
    toast({
      description: "New Video added successfully",
    })
  }

  const handleSubmit = async(e: React.FormEvent) => {
    
    e.preventDefault()
    if(session.data?.user){
      setIsLoading(true)
      const response=await fetch('/api/streams/getuser')
      const temp=await response.json()
      console.log("temp--",temp)
      const creatorid=temp.creatorId
      const newSongatcual = {
        creatorId:creatorid,
        url: newSongUrl
      }
      const res=await fetch('/api/streams',{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(newSongatcual)
      })
      const data=await res.json()
      console.log("Newly added stream-" ,data)
      // console.log("newly added stream",await res.json())

      
      
      setQueue([...queue, data.stream])
      setNewSongUrl('')
      setIsLoading(false)
      showtoast()

    }
    
  }

  const handleVote = (id: number, increment: number) => {
    setQueue(queue.map(song => 
      song.id === id ? { ...song, votes: song.upvotes + increment } : song
    ).sort((a, b) => b.upvotes - a.upvotes))
  }

  const handleShare = async() => {
    //now make a new page for this route
    const response=await fetch('/api/streams/getuser')
      const temp=await response.json()
      console.log("temp--",temp)
      const creatorid=temp.creatorId
    navigator.clipboard.writeText(`http://${window.location.host}/creator/${creatorid}`).then(() => {
      toast({
        title: "Link copied to clipboard",
        description: "Share this link with your friends!",
      })
    }, (err) => {
      console.error('Could not copy text: ', err)
    })
  }

  const playNextSong = () => {
    if (queue.length > 1) {
      const newQueue = [...queue.slice(1)]
      setQueue(newQueue)
      setCurrentSong(newQueue[0])
      toast({
        title: "Playing next song",
        description: `Now playing: ${newQueue[0].title}`,
      })
    } else {
      toast({
        title: "No more songs in queue",
        description: "Add more songs to the queue!",
        variant: "destructive",
      })
    }
  }

  const getstreams=async()=>{
    const allstreams=await fetch('/api/streams/my')
    const data=await allstreams.json()
    console.log(data)
    setQueue(data.streams)
    
  }

  useEffect(() => {
    getstreams()
    // if (queue.length > 0 && currentSong.id !== queue[0].id) {
    //   setCurrentSong(queue[0])
    // }
    console.log("inside effect")
  }, [queue.length])

  const truncateDescription = (description: string) => {
    const words = description.split(' ');
    return words.length > 10 ? words.slice(0, 10).join(' ') + '...' : description;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-gray-100 p-4">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Music Voting App</h1>
          <Button onClick={handleShare} className="bg-purple-600 hover:bg-purple-700 mt-4 md:mt-0">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
        
        <div className="mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-2">
            <h2 className="text-2xl font-semibold text-blue-300">Now Playing</h2>
            <Button onClick={playNextSong} className="bg-blue-600 hover:bg-blue-700 mt-4 md:mt-0">
              <SkipForward className="mr-2 h-4 w-4" />
              Play Next
            </Button>
          </div>
          <div className="aspect-video rounded-lg overflow-hidden shadow-lg shadow-blue-500/20">
            <iframe 
              width="100%" 
              height="100%" 
              src={currentSong?`https://www.youtube.com/embed/${currentSong.extractedId}`:`https://www.youtube.com/embed/paWE-GvDO1c`}
              title="YouTube video player" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mb-6">
          <h2 className="text-2xl font-semibold mb-2 text-blue-300">Add a Song</h2>
          <div className="flex flex-col md:flex-row gap-2">
            <Input
              type="text"
              value={newSongUrl}
              onChange={(e) => setNewSongUrl(e.target.value)}
              placeholder="Enter YouTube URL"
              className="flex-grow bg-gray-800 border-gray-700 focus:border-blue-500 focus:ring-blue-500"
            />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add to Queue'}
            </Button>
          </div>
        </form>

        <div>
          <h2 className="text-2xl font-semibold mb-2 text-blue-300">Up Next</h2>
          {queue.length>0&&queue.map((song) => (
            <Card key={song.id} className="mb-2 bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700 hover:border-blue-500 transition-colors">
              <CardContent className="flex flex-col md:flex-row items-center justify-between p-4">
                <div className="flex-grow">
                  <h3 className="font-semibold text-purple-300">{song.title}</h3>
                  <p className="text-sm text-gray-400 overflow-hidden text-ellipsis">{truncateDescription(song.description)}</p>
                </div>
                <div className="flex items-center gap-2 mt-2 md:mt-0">
                  <span className="text-lg font-bold text-blue-400">{song.upvotes}</span>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => handleVote(song.id, 1)}
                    className="hover:bg-blue-500/20 text-blue-400"
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => handleVote(song.id, -1)}
                    className="hover:bg-purple-500/20 text-purple-400"
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

