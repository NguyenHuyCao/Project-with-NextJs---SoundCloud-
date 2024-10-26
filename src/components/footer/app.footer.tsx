"use client";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Container } from "@mui/material";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { useHasMounted } from "@/utils/customHook";
import { useTrackContext } from "@/lib/track.wrapper";
import { useEffect, useRef } from "react";

const AppFooter = () => {
  const hasMounted = useHasMounted();
  const playerRef = useRef(null);
  const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;

  useEffect(() => {
    if (currentTrack?.isPlaying) {
      // @ts-ignore
      playerRef?.current?.audio?.current?.play();
    } else {
      // @ts-ignore
      playerRef?.current?.audio?.current?.pause();
    }
  }, [currentTrack]);

  if (!hasMounted) return <></>;

  return (
    <>
      {currentTrack._id && (
        <div style={{ marginTop: 50 }}>
          <AppBar
            position="fixed"
            sx={{ top: "auto", bottom: 0, background: "#f2f2f2" }}
          >
            <Toolbar>
              <Container
                sx={{ display: "flex", gap: 10, ".rhap_main": { gap: "30px" } }}
              >
                <AudioPlayer
                  ref={playerRef}
                  layout="horizontal-reverse"
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${currentTrack.trackUrl}`}
                  volume={0.5}
                  style={{ boxShadow: "unset" }}
                  onPause={() =>
                    setCurrentTrack({
                      ...currentTrack,
                      isPlaying: false,
                    })
                  }
                  onPlay={() =>
                    setCurrentTrack({
                      ...currentTrack,
                      isPlaying: true,
                    })
                  }
                />

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    justifyContent: "center",
                    minWidth: 100,
                  }}
                >
                  <div style={{ color: "#ccc" }}>
                    {currentTrack.description}{" "}
                  </div>
                  <div style={{ color: "black" }}>{currentTrack.title}</div>
                </div>
              </Container>
            </Toolbar>
          </AppBar>
        </div>
      )}
    </>
  );
};

export default AppFooter;
