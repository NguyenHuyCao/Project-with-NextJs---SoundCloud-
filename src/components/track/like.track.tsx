import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useEffect, useState } from "react";
import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface IProps {
  track: ITrackTop | null;
}

const LikeTrack = (props: IProps) => {
  const router = useRouter();
  const { track } = props;
  const { data: session } = useSession();
  const [trackLikes, setTrackLike] = useState<ITrackLike[] | null>(null);

  const fetchData = async () => {
    const res2 = await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
      method: "GET",
      queryParams: {
        current: 1,
        pageSize: 100,
        sort: "-createdAt",
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    if (res2?.data?.result) {
      setTrackLike(res2?.data?.result);
    }
  };

  useEffect(() => {
    fetchData();
  }, [session]);

  const handleLikeTrack = async () => {
    await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
      method: "POST",
      body: {
        track: track?._id,
        quantity: trackLikes?.some((t) => t._id === track?._id) ? -1 : 1,
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    fetchData();

    await sendRequest<IBackendRes<any>>({
      url: "/api/revalidate",
      method: "POST",
      queryParams: {
        tag: "track-by-id",
        secret: "huycao23",
      },
    });
    router.refresh();
  };

  return (
    <div
      style={{
        marginTop: "20px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Stack direction="row" spacing={1}>
        <Chip
          onClick={() => handleLikeTrack()}
          sx={{
            borderRadius: "5px",
          }}
          color={
            trackLikes?.some((t) => t._id === track?._id) ? "error" : "default"
          }
          size="medium"
          variant="outlined"
          clickable
          icon={<FavoriteIcon />}
          label="Like"
        />
      </Stack>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          color: "#898585",
        }}
      >
        <ArrowRightIcon sx={{ fontSize: "30px", marginRight: "-5px" }} />
        {track?.countPlay}
        <FavoriteIcon sx={{ marginLeft: "12px", fontSize: "20px" }} />
        {track?.countLike}
      </div>
    </div>
  );
};

export default LikeTrack;
