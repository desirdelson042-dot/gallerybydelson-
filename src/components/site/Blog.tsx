import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export async function Blog() {
  const supabase = await createClient();

  const { data: featured } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .eq("featured", true)
    .order("sort_order")
    .limit(3);

  let posts = featured ?? [];

  if (posts.length === 0) {
    const { data: recent } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(3);
    posts = recent ?? [];
  }

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="mx-auto max-w-6xl px-6 py-24">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-neutral-400">Writing</p>
          <h2 className="mt-2 text-3xl font-semibold">From the blog</h2>
        </div>
        <Link href="/blog" className="text-sm text-neutral-500 hover:text-neutral-900">
          View all posts →
        </Link>
      </div>

      <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
            {post.cover_image_url && (
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-neutral-100">
                <Image
                  src={post.cover_image_url}
                  alt={post.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-[1.02]"
                />
              </div>
            )}
            <p className="mt-4 text-xs text-neutral-400">{formatDate(post.published_at)}</p>
            <h3 className="mt-1 text-lg font-semibold text-neutral-900 group-hover:text-neutral-600">
              {post.title}
            </h3>
            {post.excerpt && <p className="mt-2 line-clamp-2 text-sm text-neutral-500">{post.excerpt}</p>}
          </Link>
        ))}
      </div>
    </section>
  );
}
