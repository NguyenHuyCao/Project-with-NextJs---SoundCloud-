"use client";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Container } from "@mui/material";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { useHasMounted } from "@/utils/customHook";

const AppFooter = () => {
  const hasMounted = useHasMounted();

  if (!hasMounted) return <></>;

  // console.log("backend", process.env.NEXT_PUBLIC_BACKEND_URL);

  return (
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
              layout="horizontal-reverse"
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/hoidanit.mp3`}
              volume={0.5}
              style={{ boxShadow: "unset" }}
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
              <div style={{ color: "#ccc" }}>Huy </div>
              <div style={{ color: "black" }}>Who am i </div>
            </div>
          </Container>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default AppFooter;
