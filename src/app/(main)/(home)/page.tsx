import Header from "@/components/header";
import PostFeed from "@/components/post-feed";
import TweetForm from "./tweet-form";

export default function HomePage() {
  return (
    <div>
      <Header>Home</Header>
      <TweetForm />
      <PostFeed />
    </div>
  );
}
