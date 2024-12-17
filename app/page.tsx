
import Appbar from "./comps/appbar";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Music, Radio, ThumbsUp, Users } from 'lucide-react'
import Redirect from "./comps/redirect";


export default function Home() {
  return (
    <>
      <div>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-gray-100">
        <Appbar />
        <Redirect />
          {/* <header className="container mx-auto p-4">
            <nav className="flex justify-between items-center">
              
              <div className="space-x-4">
                <Button variant="ghost">Login</Button>
                <Button>Sign Up</Button>
              </div>
            </nav>
          </header> */}

          <main className="container mx-auto px-4 py-16">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-4">Discover and Share Music Streams</h2>
              <p className="text-xl text-gray-400 mb-8">Create, join, and vote on live music streams. Your new favorite playlist is just a click away.</p>
              <Button size="lg" className="text-lg px-8">Get Started</Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <FeatureCard
                icon={<Radio className="h-12 w-12 mb-4 text-blue-500" />}
                title="Create Streams"
                description="Start your own music stream and share your taste with the world."
              />
              <FeatureCard
                icon={<ThumbsUp className="h-12 w-12 mb-4 text-green-500" />}
                title="Vote on Tracks"
                description="Influence the playlist by voting on upcoming tracks in real-time."
              />
              <FeatureCard
                icon={<Users className="h-12 w-12 mb-4 text-purple-500" />}
                title="Join Communities"
                description="Find streams that match your mood or discover new genres with like-minded listeners."
              />
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to dive in?</h3>
              <p className="text-gray-400 mb-6">Sign up now and start streaming in seconds.</p>
              <div className="flex max-w-md mx-auto">
                <Input type="email" placeholder="Enter your email" className="mr-2 bg-white text-black" />
                <Button>Join Now</Button>
              </div>
            </div>
          </main>

          <footer className="container mx-auto p-4 mt-16 text-center text-gray-500">
            <p>&copy; 2023 StreamBeats. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </>
  )
}
function FeatureCard({ icon, title, description }:{icon:any,title:String,description:String}) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 text-center">
      {icon}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}