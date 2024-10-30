"use client";
import * as React from "react";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { useSession } from "next-auth/react";
import axios from "axios";
import { sendRequest } from "@/utils/api";
import { useToast } from "@/utils/toast";
import Image from "next/image";

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary" }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

function LinearWithValueLabel(props: IProps) {
  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgressWithLabel value={props.trackUpload.percent} />
    </Box>
  );
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function InputFileUpload(props: any) {
  const { infor, setInfor } = props;
  const { data: session } = useSession();
  const toast = useToast();

  const handleUpload = async (image: any) => {
    const formData = new FormData();
    formData.append("fileUpload", image);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/files/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            target_type: "images",
          },
        }
      );
      setInfor({
        ...infor,
        imageUrl: res.data.data.fileName,
      });
    } catch (error) {
      // @ts-ignore
      toast.error(error?.response?.data?.message);
    }
  };
  // console.log("info", infor);

  return (
    <Button
      onChange={(e) => {
        const event = e.target as HTMLInputElement;
        if (event.files) {
          handleUpload(event.files[0]);
        }
      }}
      component="label"
      variant="contained"
      startIcon={<CloudUploadIcon />}
    >
      Upload files
      <VisuallyHiddenInput type="file" />
    </Button>
  );
}

interface IProps {
  trackUpload: {
    fileName: string;
    percent: number;
    uploadedTrackName: string;
  };
  setValue: (v: number) => void;
}

interface INewTrack {
  title: string;
  description: string;
  trackUrl: string;
  imageUrl: string;
  category: string;
}

const Step2 = (props: IProps) => {
  const { data: session } = useSession();
  const { trackUpload, setValue } = props;
  const toast = useToast();

  const [infor, setInfor] = React.useState<INewTrack>({
    title: "",
    description: "",
    trackUrl: "",
    imageUrl: "",
    category: "",
  });

  React.useEffect(() => {
    if (trackUpload && trackUpload.uploadedTrackName) {
      setInfor({
        ...infor,
        trackUrl: trackUpload.uploadedTrackName,
      });
    }
  }, [trackUpload]);

  const category = [
    {
      value: "CHILL",
      label: "CHILL",
    },
    {
      value: "WORKOUT",
      label: "WORKOUT",
    },
    {
      value: "PARTY",
      label: "PARTY",
    },
  ];

  const handleSubmitForm = async () => {
    const res = await sendRequest<IBackendRes<ITrackTop[]>>({
      url: "http://localhost:8000/api/v1/tracks",
      method: "POST",
      body: {
        title: infor.title,
        description: infor.description,
        trackUrl: infor.trackUrl,
        imgUrl: infor.imageUrl,
        category: infor.category,
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    if (res.data) {
      toast.success("create success");
      setValue(0);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <Box>
      <Box sx={{ width: "100%" }}>
        {trackUpload.fileName}
        <LinearWithValueLabel setValue={setValue} trackUpload={trackUpload} />
      </Box>

      <Grid container spacing={2} mt={5}>
        <Grid
          item
          xs={6}
          md={4}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div
          // style={{ height: 250, width: 250, background: "#ccc" }}
          >
            <div>
              {infor.imageUrl && (
                <Image
                  style={{ objectFit: "contain" }}
                  height={250}
                  width={250}
                  alt="step 2 track url"
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${infor.imageUrl}`}
                />
              )}
            </div>
          </div>
          <div>
            <InputFileUpload infor={infor} setInfor={setInfor} />
          </div>
        </Grid>
        <Grid item xs={6} md={8}>
          <TextField
            value={infor?.title}
            onChange={(e) =>
              setInfor({
                ...infor,
                title: e.target.value,
              })
            }
            label="Title"
            fullWidth
            variant="standard"
            margin="dense"
          />
          <TextField
            value={infor?.description}
            onChange={(e) =>
              setInfor({
                ...infor,
                description: e.target.value,
              })
            }
            label="Decription"
            fullWidth
            variant="standard"
            margin="dense"
          />
          <TextField
            value={infor?.category}
            onChange={(e) =>
              setInfor({
                ...infor,
                category: e.target.value,
              })
            }
            sx={{ mt: 3 }}
            select
            fullWidth
            label="Category"
            variant="standard"
          >
            {category.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Button
            onClick={() => handleSubmitForm()}
            variant="outlined"
            sx={{ mt: 5 }}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Step2;
