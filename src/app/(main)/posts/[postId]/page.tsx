import Header from "@/components/header";
import Content from "./content";

type Props = {
  params: { postId: string };
};

export default function PostDetail({ params }: Props) {
  return (
    <div className="grow h-full">
      <Header showBackArrow>Tweet</Header>
      <Content postId={params.postId} />
    </div>
  );
}
