import { Button } from "@/components/ui/button";
import { Camera, Video } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white sm:text-6xl">
            Share Your Camera Stream
          </h1>
          <p className="text-xl text-gray-300">
            Start streaming your camera and share the link with anyone
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/stream">
            <Button size="lg" className="gap-2">
              <Camera className="w-5 h-5" />
              Start Streaming
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-16">
          <div className="bg-gray-800/50 p-6 rounded-lg">
            <Video className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Easy Sharing</h3>
            <p className="text-gray-400">
              Get a unique link to share your camera stream with anyone instantly
            </p>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-lg">
            <Camera className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Simple Controls</h3>
            <p className="text-gray-400">
              Easily control your camera and audio with intuitive toggles
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}