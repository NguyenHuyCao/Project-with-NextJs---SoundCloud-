import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AddPlaylistTrack from "@/components/playlist/add.playlist.track";
import NewPlaylist from "@/components/playlist/new.playlist";
import { sendRequest } from "@/utils/api";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  Divider,
  Typography,
} from "@mui/material";
import { getServerSession } from "next-auth";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CurrentTrack from "@/components/playlist/current.track";

const PlaylistPage = async () => {
  const session = await getServerSession(authOptions);

  const res = await sendRequest<IBackendRes<IModelPaginate<IPlaylist>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/by-user`,
    method: "POST",
    queryParams: { current: 1, pageSize: 100 },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      next: { tags: ["playlist-by-user"] },
    },
  });

  const res1 = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks`,
    method: "GET",
    queryParams: { current: 1, pageSize: 100 },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
  });

  return (
    <Container sx={{ mt: "20px", background: "#f3f6f9 ", padding: "40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontWeight: 900 }}>Danh sách phát</p>
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          <NewPlaylist />
          <AddPlaylistTrack
            playlists={res.data?.result!}
            tracks={res1.data?.result!}
          />
        </div>
      </div>
      <Divider variant="middle" />
      {res && (
        <Box sx={{ mt: "20px" }}>
          {res.data?.result.map((item) => {
            return (
              <Accordion defaultExpanded key={item._id}>
                <Box sx={{ height: "60px", fontWeight: 600 }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                  >
                    <Typography sx={{ fontWeight: 500 }}>
                      {item.title}
                    </Typography>
                  </AccordionSummary>
                </Box>
                <AccordionDetails>
                  {item.tracks && item.tracks.length > 0
                    ? item.tracks.map((track: any, index) => {
                        return (
                          <CurrentTrack key={item._id + index} track={track!} />
                        );
                      })
                    : "No data"}
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      )}
    </Container>
  );
};

export default PlaylistPage;
