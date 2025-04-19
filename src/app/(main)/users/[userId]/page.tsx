import Header from "@/components/header";
import Content from "./content";

type Props = {
  params: { userId: string };
};

export default function UserProfilePage({ params }: Props) {
  return (
    <div className="grow h-full">
      <Header showBackArrow>User Profile</Header>
      <Content userId={params.userId} />
    </div>
  );
}
