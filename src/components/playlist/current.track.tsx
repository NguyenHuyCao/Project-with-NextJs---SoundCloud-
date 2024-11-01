"use client";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { useTrackContext } from "@/lib/track.wrapper";
import { useRouter } from "next/navigation";
import { convertSlugUrl, sendRequest } from "@/utils/api";
import Link from "next/link";

interface IProps {
  track: IShareTrack;
}

const CurrentTrack = (props: IProps) => {
  const { track } = props;
  const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;

  const handlePlayTrack = async () => {
    await sendRequest<IBackendRes<any>>({
      url: "/api/revalidate",
      method: "POST",
      queryParams: {
        tag: "playlist-by-user",
        secret: "justArandomString",
      },
    });
    setCurrentTrack({ ...track, isPlaying: true });
  };
  console.log(track);
  return (
    <Box>
      <Box
        sx={{
          padding: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          style={{
            textDecoration: "none",
            color: "unset",
          }}
          href={`/track/${convertSlugUrl(track.title)}-${
            track._id
          }.html?audio=${track.trackUrl}`}
        >
          <Typography component="p">{track.title}</Typography>
        </Link>

        {(track._id !== currentTrack._id ||
          (track._id === currentTrack._id &&
            currentTrack.isPlaying === false)) && (
          <IconButton
            aria-label="play/pause"
            onClick={(e) => {
              handlePlayTrack();
            }}
          >
            <PlayArrowIcon sx={{ height: 25, width: 25 }} />
          </IconButton>
        )}

        {track._id === currentTrack._id && currentTrack.isPlaying === true && (
          <IconButton
            aria-label="play/pause"
            onClick={(e) => {
              setCurrentTrack({ ...track, isPlaying: false });
            }}
          >
            <PauseIcon sx={{ height: 25, width: 25 }} />
          </IconButton>
        )}
      </Box>
      <Divider variant="middle" />
    </Box>
  );
};

export default CurrentTrack;
