import { fetchDefaultImages } from "@/utils/api";
import { Box, TextField } from "@mui/material";
import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

interface IProps {
  comments: ITrackComment[] | [];
  track: ITrackTop | null;
}

const CommentTrack = (props: IProps) => {
  const { track, comments } = props;
  const [yourComment, setYourComment] = useState<string>("");

  dayjs.extend(relativeTime);
  const handleSubmit = () => {};

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
          <img
            style={{
              height: 150,
              width: 150,
            }}
            src={fetchDefaultImages(track?.uploader?.type!)}
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
                  <img
                    style={{ width: 40, height: 40 }}
                    src={fetchDefaultImages(comment.user.type)}
                  />
                  <div>
                    <div style={{ fontSize: "13px" }}>
                      {comment?.user?.name}
                    </div>
                    <div>{comment.content}</div>
                  </div>
                </Box>
                <div style={{ fontSize: "12px", color: "#999" }}>
                  {dayjs(comment.createdAt).fromNow()}
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
