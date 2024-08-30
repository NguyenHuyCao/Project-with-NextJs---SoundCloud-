"use client";
import WaveTrack from "@/components/track/wave.track";
import { useSearchParams } from "next/navigation";

const DetailTrackPage = ({ params }: { params: { slug: string } }) => {
  const searchParams = useSearchParams();

  const search = searchParams.get("audio");

  return (
    <div>
      detailtrack
      <WaveTrack />
    </div>
  );
};

export default DetailTrackPage;
