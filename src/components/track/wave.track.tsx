"use client";
import WaveSurfer from "wavesurfer.js";
import { useEffect } from "react";

const WaveTrack = () => {
  useEffect(() => {
    if (document.getElementById("huy")) {
      WaveSurfer.create({
        container: document.getElementById("huy")!,
        waveColor: "rgb(200, 0, 200)",
        progressColor: "rgb(100, 0, 100)",
        url: "/audio/hoidanit.mp3",
      });
    }
  }, []);

  return <div id="huy">wave track</div>;
};

export default WaveTrack;
