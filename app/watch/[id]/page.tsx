"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import Peer from "peerjs";

export default function WatchPage({ params }: { params: { id: string } }) {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const peer = new Peer();

    peer.on("open", () => {
      const conn = peer.connect(params.id);
      
      peer.on("call", (call) => {
        call.answer();
        
        call.on("stream", (remoteStream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = remoteStream;
            setIsConnected(true);
          }
        });
      });

      conn.on("close", () => {
        setIsConnected(false);
        setError("Stream ended by broadcaster");
      });
    });

    peer.on("error", (err) => {
      console.error("Peer connection error:", err);
      setError("Failed to connect to stream");
    });

    return () => {
      peer.destroy();
    };
  }, [params.id]);

  const toggleAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsAudioEnabled(!videoRef.current.muted);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="bg-gray-800/50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Stream Error</h2>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800/50 rounded-lg overflow-hidden">
          {!isConnected && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          )}
          
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full aspect-video bg-black"
          />
          
          <div className="p-4 flex justify-end">
            <Button
              variant={isAudioEnabled ? "default" : "destructive"}
              size="icon"
              onClick={toggleAudio}
            >
              {isAudioEnabled ? (
                <Volume2 className="h-5 w-5" />
              ) : (
                <VolumeX className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}