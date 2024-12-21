"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Link as LinkIcon, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Peer from "peerjs";

export default function StreamPage() {
  const [peerId, setPeerId] = useState<string>("");
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const peerRef = useRef<Peer | null>(null);

  useEffect(() => {
    const initPeer = async () => {
      const peer = new Peer();
      peerRef.current = peer;

      peer.on("open", (id) => {
        setPeerId(id);
      });

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
        toast.error("Failed to access camera or microphone");
      }
    };

    initPeer();

    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
      peerRef.current?.destroy();
    };
  }, []);

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoEnabled(videoTrack.enabled);
    }
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioEnabled(audioTrack.enabled);
    }
  };

  const copyLink = () => {
    const link = `${window.location.origin}/watch/${peerId}`;
    navigator.clipboard.writeText(link);
    toast.success("Stream link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800/50 rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full aspect-video bg-black"
          />
          
          <div className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={isVideoEnabled ? "default" : "destructive"}
                size="icon"
                onClick={toggleVideo}
              >
                {isVideoEnabled ? (
                  <Video className="h-5 w-5" />
                ) : (
                  <VideoOff className="h-5 w-5" />
                )}
              </Button>
              <Button
                variant={isAudioEnabled ? "default" : "destructive"}
                size="icon"
                onClick={toggleAudio}
              >
                {isAudioEnabled ? (
                  <Mic className="h-5 w-5" />
                ) : (
                  <MicOff className="h-5 w-5" />
                )}
              </Button>
            </div>

            <div className="flex-1 max-w-xl flex gap-2">
              <Input
                value={`${window.location.origin}/watch/${peerId}`}
                readOnly
                className="bg-gray-700 text-white"
              />
              <Button onClick={copyLink}>
                <LinkIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}