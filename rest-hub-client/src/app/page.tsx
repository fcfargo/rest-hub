import PostList from './posts/list/postList';

export default async function Home() {
  return (
    <div className="flex justify-center items-center flex-grow  overflow-y-auto">
      <PostList />
    </div>
  );
}
