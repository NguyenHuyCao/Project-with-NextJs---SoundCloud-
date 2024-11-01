"use client";
import { sendRequest } from "@/utils/api";
import { Box, Divider } from "@mui/material";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const ClientSearch = () => {
  const search = useSearchParams();
  const query = search.get("q");
  const [tracks, setTracks] = useState<ITrackTop[] | []>([]);

  const fetchData = async () => {
    const res = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/search`,
      method: "POST",
      body: {
        current: 1,
        pageSize: 10,
        title: query,
      },
    });
    if (res.data) {
      setTracks(res.data.result);
    }
  };

  useEffect(() => {
    document.title = `${query} in HuySC`;

    if (query) fetchData();
  }, [query]);

  return (
    <div>
      <p>Kết quả tìm kiếm từ khoá: {query}</p>
      <Divider variant="middle" />
      <Box sx={{ mt: "15px" }}>
        {tracks &&
          tracks.map((track) => {
            return (
              <Box
                sx={{
                  display: "flex",
                  gap: "20px",
                  mt: "10px",
                  alignItems: "center",
                }}
              >
                <Image
                  alt={track.description}
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`}
                  width={80}
                  height={80}
                  style={{ objectFit: "contain" }}
                />
                <div>
                  <p>{track.title}</p>
                </div>
              </Box>
            );
          })}
      </Box>
    </div>
  );
};

export default ClientSearch;
