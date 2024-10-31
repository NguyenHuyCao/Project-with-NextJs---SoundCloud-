import WaveTrack from "@/components/track/wave.track";
import { Container } from "@mui/material";
import { sendRequest } from "@/utils/api";
import { notFound } from "next/navigation";

import type { Metadata } from "next";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const temp = params.slug.split(".html")[0].split("-") ?? [];
  const id = temp[temp.length - 1];
  // fetch data
  const res = await sendRequest<IBackendRes<ITrackTop>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
    method: "GET",
  });

  return {
    title: res.data?.title,
    description: res.data?.description,
    openGraph: {
      title: "Hỏi Dân IT",
      description: "Beyond Your Coding Skills",
      type: "website",
      images: [
        `https://raw.githubusercontent.com/hoidanit/imageshosting/master/eric.png`,
      ],
    },
  };
}

export async function generateStaticParams() {
  return [
    { slug: "tinh-co-yeu-em-66c9a5731d4a0620af469777.html" },
    { slug: "rolling-down-66c9a5731d4a0620af469772.html" },
    { slug: "le-luu-ly-66c9a5731d4a0620af469774.html" },
  ];
}

const DetailTrackPage = async (props: any) => {
  const { params } = props;
  const temp = params.slug.split(".html")[0].split("-") ?? [];
  const id = temp[temp.length - 1];

  const res = await sendRequest<IBackendRes<ITrackTop>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
    method: "GET",
    // nextOption: { cache: "no-store" },
  });

  const res1 = await sendRequest<IBackendRes<IModelPaginate<ITrackComment>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/comments`,
    method: "POST",
    queryParams: {
      current: 1,
      pageSize: 100,
      trackId: id,
      sort: "-createdAt",
    },
  });

  if (!res?.data) notFound();

  return (
    <Container>
      <div>
        <WaveTrack
          track={res?.data ?? null}
          comments={res1?.data?.result ?? []}
        />
      </div>
    </Container>
  );
};

export default DetailTrackPage;
