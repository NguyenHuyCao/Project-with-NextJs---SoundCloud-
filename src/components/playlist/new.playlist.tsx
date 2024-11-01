"use client";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Switch,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useToast } from "@/utils/toast";
import { useRouter } from "next/navigation";

const NewPlaylist = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const { data: session } = useSession();
  const toast = useToast();
  const route = useRouter();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event: object, reason: string) => {
    if (reason && reason == "backdropClick") return;
    setOpen(false);
    setTitle("");
    setIsPublic(true);
  };

  const handleSubmit = async () => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/empty`,
      method: "POST",
      body: { title: title, isPublic: isPublic },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });

    if (res.data) {
      toast.success("Tạo mới playlist thành công!");
      setIsPublic(true);
      setTitle("");
      setOpen(false);
      setOpen(false);

      await sendRequest<IBackendRes<any>>({
        url: "/api/revalidate",
        method: "POST",
        queryParams: {
          tag: "playlist-by-user",
          secret: "justArandomString",
        },
      });
      route.refresh();
    } else {
      toast.error(res.message);
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
        <p style={{ margin: 0, fontWeight: 600 }}>PLAYLIST</p>
      </Button>
      <Dialog onClose={handleClose} open={open} maxWidth={"sm"} fullWidth>
        <DialogTitle>Thêm mới playlist:</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              gap: "30px",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <TextField
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              label="Standard"
              variant="standard"
            />
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    defaultChecked
                    checked={isPublic}
                    onClick={() => setIsPublic(!isPublic)}
                  />
                }
                label={isPublic ? "Public" : "Private"}
              />
            </FormGroup>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => handleSubmit()}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NewPlaylist;
