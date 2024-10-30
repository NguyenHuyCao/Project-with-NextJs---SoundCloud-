"use client";
import { fetchDefaultImages, sendRequest } from "@/utils/api";
import { Box, TextField } from "@mui/material";
import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import WaveSurfer from "wavesurfer.js";
import { useHasMounted } from "@/utils/customHook";
import Image from "next/image";
dayjs.extend(relativeTime);
interface IProps {
  comments: ITrackComment[] | [];
  track: ITrackTop | null;
  wavesurfer: WaveSurfer | null;
}

const CommentTrack = (props: IProps) => {
  const hasMounted = useHasMounted();
  const router = useRouter();
  const { data: session } = useSession();
  const { track, comments, wavesurfer } = props;
  const [yourComment, setYourComment] = useState<string>("");

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.round(seconds) % 60;
    const paddedSeconds = `0${secondsRemainder}`.slice(-2);
    return `${minutes}:${paddedSeconds}`;
  };

  const handleSubmit = async () => {
    // const session = await getServerSession(authOptions);
    const res = await sendRequest<IBackendRes<ITrackTop[]>>({
      url: "http://localhost:8000/api/v1/comments",
      method: "POST",
      body: {
        content: yourComment,
        moment: Math.round(wavesurfer?.getCurrentTime() ?? 0),
        track: track?._id,
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    if (res.data) {
      setYourComment("");
      router.refresh();
    }
  };

  const handleJumpTrack = (moment: number) => {
    if (wavesurfer) {
      const duration = wavesurfer.getDuration();
      wavesurfer.seekTo(moment / duration);
      wavesurfer.play();
    }
  };

  return (
    <div>
      <div style={{ marginTop: 50, marginBottom: 25 }}>
        <TextField
          value={yourComment}
          onChange={(e) => setYourComment(e.target.value)}
          fullWidth
          id="standard-basic"
          label="Comments"
          variant="standard"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
        />
      </div>
      <div style={{ display: "flex" }}>
        <div className="left" style={{ width: 200 }}>
          <Image
            height={150}
            width={150}
            src={fetchDefaultImages(track?.uploader?.type!)}
            alt="avatar comment"
          />
          <div>{track?.uploader?.email}</div>
        </div>
        <div className="right" style={{ width: "calc(100% - 200px)" }}>
          {comments.map((comment: ITrackComment) => {
            return (
              <Box
                key={comment._id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    marginBottom: "25px",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <Image
                    width={40}
                    height={40}
                    alt="comment"
                    src={fetchDefaultImages(comment.user.type)}
                  />
                  <div>
                    <div style={{ fontSize: "13px" }}>
                      {comment?.user?.name && comment?.user?.email} at
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => handleJumpTrack(comment.moment)}
                      >
                        &nbsp;
                        {formatTime(comment.moment)}
                      </span>
                    </div>
                    <div>{comment.content}</div>
                  </div>
                </Box>
                <div style={{ fontSize: "12px", color: "#999" }}>
                  {hasMounted && dayjs(comment.createdAt).fromNow()}
                </div>
              </Box>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CommentTrack;
