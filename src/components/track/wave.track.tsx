"use client";
import WaveSurfer from "wavesurfer.js";
import { useEffect, useRef } from "react";

const WaveTrack = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      WaveSurfer.create({
        container: containerRef.current,
        waveColor: "rgb(200, 0, 200)",
        progressColor: "rgb(100, 0, 100)",
        url: "/audio/hoidanit.mp3",
      });
    }
  }, []);

  return <div ref={containerRef}>wave track</div>;
};

export default WaveTrack;
