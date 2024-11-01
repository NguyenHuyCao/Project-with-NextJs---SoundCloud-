"use client";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { useState } from "react";
import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useToast } from "@/utils/toast";
import { useRouter } from "next/navigation";

interface IProps {
  playlists: IPlaylist[];
  tracks: ITrackTop[];
}

const AddPlaylistTrack = (props: IProps) => {
  const { playlists, tracks } = props;
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const toast = useToast();
  const route = useRouter();
  const [trackId, setTrackId] = useState([]);

  const [choosePlaylist, setChoosePlaylist] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event: any, reason: any) => {
    if (reason && reason == "backdropClick") return;
    setOpen(false);
    setChoosePlaylist("");
    setTrackId([]);
  };

  const handleSubmit = async () => {
    if (!choosePlaylist) {
      toast.error("Vui lòng chọn playlist");
      return;
    }
    if (!trackId) {
      toast.error("Vui lòng chọn track");
      return;
    }

    const playlist = playlists.find(
      (i) => i._id === choosePlaylist
    ) as IPlaylist;
    // const track = tracks.filter((i) => trackId.some((b) => b === i._id));

    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists`,
      method: "PATCH",
      body: {
        id: playlist._id,
        title: playlist.title,
        isPublic: playlist.isPublic,
        tracks: trackId,
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    if (res.data) {
      toast.success("Thêm track vào playlist thành công!");
      setOpen(false);

      await sendRequest<IBackendRes<any>>({
        url: "/api/revalidate",
        method: "POST",
        queryParams: {
          tag: "playlist-by-user",
          secret: "justArandomString",
        },
      });
      handleClose("", "");
      route.refresh();
    } else {
      toast.error("Thêm track vào playlist thất bại!");
    }
  };

  return (
    <div>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "5px 10px",
          gap: "5px",
        }}
      >
        <div>
          <AddIcon
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "20px",
            }}
          />
        </div>
        <p style={{ margin: 0, fontWeight: 600 }}>TRACKS</p>
      </Button>
      <Dialog onClose={handleClose} open={open} maxWidth={"sm"} fullWidth>
        <DialogTitle>Thêm track to playlist:</DialogTitle>
        <DialogContent>
          <Box
            width={"100%"}
            sx={{
              display: "flex",
              gap: "30px",
              flexDirection: "column",
            }}
          >
            <Box>
              <FormControl
                fullWidth
                variant="standard"
                sx={{ m: 1, minWidth: 120 }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  Chọn playlist
                </InputLabel>
                <Select
                  value={choosePlaylist}
                  onChange={(e) => setChoosePlaylist(e.target.value)}
                  label="Playlist"
                >
                  {playlists &&
                    playlists.map((item, index) => {
                      return (
                        <MenuItem key={item._id} value={item._id}>
                          {item.title}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ width: "100%" }}>
              <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel id="demo-multiple-chip-label">Tracks</InputLabel>
                <Select
                  multiple
                  value={trackId}
                  onChange={(e) => setTrackId(e.target.value as any)}
                  input={<OutlinedInput label="Track" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {tracks.map((track) => (
                    <MenuItem key={track._id} value={track._id}>
                      {track.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose("", "")}>Cancel</Button>
          <Button onClick={() => handleSubmit()}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddPlaylistTrack;
