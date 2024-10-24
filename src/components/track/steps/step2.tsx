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

function InputFileUpload() {
  return (
    <Button
      component="label"
      variant="contained"
      startIcon={<CloudUploadIcon />}
    >
      Upload files
      <VisuallyHiddenInput type="file" />
    </Button>
  );
}

const Step2 = () => {
  const [progress, setProgress] = React.useState(10);

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

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 10 : prevProgress + 10
      );
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box>
      <Box sx={{ width: "100%" }}>
        Your uploading track:
        <LinearProgressWithLabel value={progress} />
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
          <div style={{ height: 250, width: 250, background: "#ccc" }}>
            <div></div>
          </div>
          <div>
            <InputFileUpload />
          </div>
        </Grid>
        <Grid item xs={6} md={8}>
          <TextField
            label="Title"
            id="standard-basic"
            fullWidth
            variant="standard"
            margin="dense"
          />
          <TextField
            label="Decription"
            id="standard-basic"
            fullWidth
            variant="standard"
            margin="dense"
          />
          <TextField
            sx={{ mt: 3 }}
            id="standard-select-currency-native"
            select
            fullWidth
            label="Category"
            variant="standard"
          >
            {category.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
          <Button variant="outlined" sx={{ mt: 5 }}>
            Save
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Step2;
