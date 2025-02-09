'use client'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown, SkipForward, Share2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { useSession } from 'next-auth/react'
import { io } from 'socket.io-client'
import Appbar from '../comps/appbar'

const initialQueue: any[] = []
const cs: any = {}

export default function MusicVotingApp() {

  var socket: any = io('https://musick-backend.onrender.com')

  const [queue, setQueue] = useState(initialQueue)
  const [newSongUrl, setNewSongUrl] = useState('')
  const [currentSong, setCurrentSong] = useState(cs)
  const { toast } = useToast()
  const session = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const showtoast = () => {
    toast({
      description: "New Video added successfully",
    })
  }

  socket.on('updatelist', () => {
    getstreams()
  })

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault()
    if (session.data?.user) {
      setIsLoading(true)
      const response = await fetch('/api/streams/getuser')
      const temp = await response.json()
      console.log("temp--", temp)
      const creatorid = temp.creatorId
      const newSongatcual = {
        creatorId: creatorid,
        url: newSongUrl
      }
      const res = await fetch('/api/streams', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newSongatcual)
      })
      const data = await res.json()
      console.log(data)
      // console.log("Newly added stream-", data)
      // console.log("newly added stream",await res.json())



      if (data.status !== -1) {
        setQueue([...queue, data.stream])
        socket.emit('addednewsong')
        setNewSongUrl('')
        setIsLoading(false)
        showtoast()
      } else {
        toast({
          title: "Cannot add song",
          description: "Only chrome video urls accepted",
        })
        setIsLoading(false)
        setNewSongUrl('')
      }

    }

  }

  const handleVote = async (id: number, increment: number, creatorid: number) => {
    //console.log("streamid-",id)

    const response = await fetch(increment == 1 ? '/api/streams/upvotes' : '/api/streams/downvotes', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ streamId: id, fromuser: 0 })
    })
    const r = await response.json()


    if (r.status == 1) {
      socket.emit('update', creatorid, id, increment)

      setQueue(queue.map(song =>
        song.id === id ? { ...song, upvotes: song.upvotes + increment } : song
      ).sort((a, b) => b.upvotes - a.upvotes))
      //console.log("after sorting-",queue)
    }
    else {
      toast({
        title: "Alert",
        description: "Cannot upvote or downvote more than once!!",
        variant: "destructive",
      })
    }
  }

  socket.on('recv', (data: any) => {
    // console.log("received from socket- ",data)
    let id = data.songid
    //check a condityion for upvote and downvote, right now only there for increment
    setQueue(queue.map(song =>
      song.id === id ? { ...song, upvotes: song.upvotes + data.increment } : song
    ).sort((a, b) => b.upvotes - a.upvotes))
  })

  const handleShare = async () => {
    //now make a new page for this route
    const response = await fetch('/api/streams/getuser')
    const temp = await response.json()
    // console.log("temp--", temp)
    const creatorid = temp.creatorId
    navigator.clipboard.writeText(`http://${window.location.host}/creator/${creatorid}`).then(() => {
      toast({
        title: "Link copied to clipboard",
        description: "Share this link with your friends!",
      })
    }, (err) => {
      console.error('Could not copy text: ', err)
    })
  }

  const playNextSong = async () => {
    if (queue.length > 1) {
      const newQueue = [...queue.slice(1)]
      //delete
      const res = await fetch('/api/streams/deletestream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ streamId: queue[0].id, userId: queue[0].userId })
      })
      // console.log(await res.json())
      setQueue(newQueue)
      setCurrentSong(newQueue[0])
      toast({
        title: "Playing next song",
        description: `Now playing: ${newQueue[0].title}`,
      })
    } else {
      if (queue.length == 1) {
        const newQueue: any = []
        //delete
        const res = await fetch('/api/streams/deletestream', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ streamId: queue[0].id, userId: queue[0].userId })
        })
        // console.log(await res.json())
        setQueue(newQueue)
        setCurrentSong(cs)
        toast({
          title: "No more songs in queue",
          description: "Add more songs to the queue!",
          variant: "destructive",
        })
      }
      else {
        toast({
          title: "No Songs",
          description: "No songs left in the queue to play next",
          variant: "destructive",
        })
      }
    }
  }

  const getstreams = async () => {
    const allstreams = await fetch('/api/streams/my')
    const data = await allstreams.json()
    console.log(data.streams)
    let tempdata = data.streams.sort((a: any, b: any) => b.upvotes - a.upvotes)
    setQueue(tempdata)
  }

  useEffect(() => {
    getstreams()
    if (queue.length > 0 && currentSong?.id !== queue[0].id) {
      setCurrentSong(queue[0])
    }
  }, [queue.length, currentSong])

  const truncateDescription = (description: string) => {
    const words = description.split(' ');
    return words.length > 10 ? words.slice(0, 10).join(' ') + '...' : description;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-2">
      <Appbar />
      <div className="max-w-4xl mx-auto px-4">


        <div className="mb-6">
          <div className="flex flex-row justify-between items-center mb-4">
            <h2 className="md:text-2xl text-2xl  text-blue-300">Now Playing</h2>
            <div className='flex flex-col md:flex-row gap-2'>
            <Button onClick={playNextSong} className="bg-blue-600 hover:bg-blue-700 mt-0 px-3">
              <SkipForward className="mr-2 h-4 w-4" />
              Play Next
            </Button>
            <Button onClick={handleShare} className="bg-purple-600 hover:bg-purple-700 mt-1 md:mt-0 px-3">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            </div>
          </div>
          <div className="aspect-video rounded-lg overflow-hidden shadow-lg shadow-blue-500/20">
            <iframe
              width="100%"
              height="100%"
              src={currentSong ? `https://www.youtube.com/embed/${currentSong.extractedId}` : `https://www.youtube.com/embed/paWE-GvDO1c`}
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
          {
            queue.length == 0 &&
            <div className='border-2 m-1 p-2 text-center rounded-xl border-dotted border-blue-400'>
              <div>No Songs in the queue yet!</div>
            </div>
          }
          {queue.length > 0 && queue.map((song) => (
            <Card key={song.id} className="mb-2 bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700 hover:border-blue-500 transition-colors">
              <CardContent className="flex flex-col md:flex-row items-center justify-between p-4">
                <div className="flex-grow">
                  <h3 className="font-semibold text-purple-300">{song.title}</h3>
                  <p className="text-sm text-gray-400 overflow-hidden text-ellipsis"><span className='font-semibold'>Description-</span>{truncateDescription(song.description)}</p>
                </div>
                <div className="flex items-center gap-2 mt-2 md:mt-0">
                  <span className="text-lg font-bold text-blue-400">{song.upvotes}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleVote(song.id, 1, song.userId)}
                    className="hover:bg-blue-500/20 text-blue-400"
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleVote(song.id, -1, song.userId)}
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

