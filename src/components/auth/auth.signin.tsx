"use client";
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Grid, TextField } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import { signIn } from "next-auth/react";

const AuthSignIn = (prop: any) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [errorUsername, setErrorUsername] = useState<string>("");
  const [errorPassword, setErrorPassword] = useState<string>("");

  const [isErrorUsername, setIsErrorUsername] = useState<boolean>(false);
  const [isErrorPassword, setIsErrorPassword] = useState<boolean>(false);

  const handleSubmit = () => {
    setIsErrorPassword(false);
    setIsErrorUsername(false);
    setErrorPassword("");
    setErrorUsername("");

    if (!username) {
      setIsErrorUsername(true);
      setErrorUsername("Username is not empty.");
      return;
    }
    if (!password) {
      setIsErrorPassword(true);
      setPassword("Password is not empty.");
      return;
    }
    console.log("user name: ", username, " password: ", password);
  };

  return (
    <Box>
      <Grid
        container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          lg={4}
          sx={{
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          }}
        >
          <div style={{ margin: "20px" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <Avatar>
                <LockIcon />
              </Avatar>

              <Typography component="h1">Sign in</Typography>
            </Box>

            <TextField
              label="Username"
              variant="outlined"
              name="username"
              onChange={(event) => setUsername(event.target.value)}
              required
              fullWidth
              autoFocus
              margin="normal"
              error={isErrorUsername}
              helperText={errorUsername}
            />
            <TextField
              label="Password"
              variant="outlined"
              onChange={(event) => setPassword(event.target.value)}
              margin="normal"
              required
              name="password"
              fullWidth
              type={showPassword ? "text" : "password"}
              error={isErrorPassword}
              helperText={errorPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword === false ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              sx={{ my: 3 }}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Sign IN
            </Button>
            <Divider>Or using</Divider>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: "25px",
                mt: 3,
              }}
            >
              <Avatar
                sx={{
                  cursor: "pointer",
                  bgcolor: "orange",
                }}
                onClick={() => signIn("github")}
              >
                <GitHubIcon titleAccess="Login with Github" />
              </Avatar>
              <Avatar
                sx={{
                  cursor: "pointer",
                  bgcolor: "orange",
                }}
              >
                <GoogleIcon titleAccess="Login with Google" />
              </Avatar>
            </Box>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AuthSignIn;
