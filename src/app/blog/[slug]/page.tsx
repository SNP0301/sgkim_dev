import { getPost } from "@/lib/posts";



export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
    const { slug } = await params;
  const post = await getPost(slug);

  return (
    <article style={{ maxWidth: "700px", margin: "40px auto" }}>
      <h1>{post.title}</h1>
      <p>{post.date}</p>
      <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
    </article>
  );
}