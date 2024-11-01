import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { convertSlugUrl, sendRequest } from "@/utils/api";
import { Box, Container, Divider } from "@mui/material";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Huy Like Page",
  description: "...",
};

const LikePage = async () => {
  const session = await getServerSession(authOptions);

  const res = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
    method: "GET",
    queryParams: { current: 1, pageSize: 100 },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      next: { tags: ["liked-by-user"] },
    },
  });

  console.log(res);

  return (
    <Container>
      <h3>Hear the tracks you've liked:</h3>
      <Divider variant="middle" />
      <Box sx={{ mt: "20px", display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {res &&
          res.data &&
          res.data?.result.map((track, index) => {
            return (
              <div className="track" key={track._id}>
                <div
                  style={{
                    position: "relative",
                    height: "175px",
                    width: "175px",
                  }}
                >
                  <Image
                    alt={track.description}
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`}
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <Link
                  href={`/track/${convertSlugUrl(track.title)}-${
                    track._id
                  }.html?audio=${track.trackUrl}`}
                  style={{
                    textDecoration: "none",
                    color: "#343333",
                    fontSize: "15px",
                  }}
                >
                  <div
                    style={{
                      alignItems: "start",
                      justifyContent: "center",
                      width: "150px",
                    }}
                  >
                    <p
                      style={{
                        marginTop: "10px",
                        width: "100%",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {track.title}
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
      </Box>
    </Container>
  );
};

export default LikePage;
