import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { formatDate } from "@/lib/utils";

export default async function BlogIndexPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 py-24">
          <p className="text-sm uppercase tracking-wide text-neutral-400">Writing</p>
          <h1 className="mt-2 text-4xl font-semibold">Blog</h1>

          {!posts || posts.length === 0 ? (
            <p className="mt-12 text-sm text-neutral-400">No posts published yet.</p>
          ) : (
            <div className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
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
                  <h2 className="mt-1 text-lg font-semibold text-neutral-900 group-hover:text-neutral-600">
                    {post.title}
                  </h2>
                  {post.excerpt && <p className="mt-2 line-clamp-2 text-sm text-neutral-500">{post.excerpt}</p>}
                  {post.categories.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {post.categories.map((c) => (
                        <span
                          key={c}
                          className="rounded-full border border-neutral-200 px-2.5 py-0.5 text-[11px] text-neutral-500"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
