import { sendRequest } from "@/utils/api";

const ProfilePage = async ({ params }: { params: { slug: string } }) => {
  const tracks = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: "http://localhost:8000/api/v1/tracks/users?current=1&pageSize=10",
    method: "POST",
    body: { id: params.slug },
  });
  console.log("tracks", tracks);
  return <div>profile {params.slug}</div>;
};

export default ProfilePage;
