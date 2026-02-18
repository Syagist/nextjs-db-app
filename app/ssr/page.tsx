import { prisma } from "@/lib/prisma";
import CreatePostButton from "@/app/components/CreatePostButton";

export const dynamic = "force-dynamic"; // SSR

export default async function SSRPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">SSR Page</h1>

      <CreatePostButton />

      <div className="mt-6 space-y-4">
        {posts?.length ? (
          posts.map((post) => (
            <div key={post.id} className="border p-4 rounded">
              <h2 className="font-semibold">{post.title}</h2>
              <p>{post.content}</p>
            </div>
          ))
        ) : (
          <div>Nothing found</div>
        )}
      </div>
    </div>
  );
}
