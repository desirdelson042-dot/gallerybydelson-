import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { formatDate } from "@/lib/utils";
import type { Json } from "@/lib/database.types";

type GalleryEntry = { url: string; alt: string; caption: string };

function parseGallery(value: Json | null): GalleryEntry[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is Record<string, Json> => typeof item === "object" && item !== null && !Array.isArray(item))
    .map((item) => ({
      url: typeof item.url === "string" ? item.url : "",
      alt: typeof item.alt === "string" ? item.alt : "",
      caption: typeof item.caption === "string" ? item.caption : "",
    }))
    .filter((item) => item.url);
}

async function getPost(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("blog_posts").select("*").eq("slug", slug).single();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt || undefined,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const gallery = parseGallery(post.gallery);

  return (
    <>
      <Header />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-6 py-24">
          {post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
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
          <h1 className="mt-4 text-4xl font-semibold">{post.title}</h1>
          <p className="mt-3 text-sm text-neutral-400">{formatDate(post.published_at)}</p>

          {post.cover_image_url && (
            <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-neutral-100">
              <Image src={post.cover_image_url} alt={post.title} fill className="object-cover" priority />
            </div>
          )}

          {post.content && (
            <div className="mt-10 max-w-2xl whitespace-pre-line text-neutral-600">{post.content}</div>
          )}

          {gallery.length > 0 && (
            <div className="mt-14 grid gap-6 sm:grid-cols-2">
              {gallery.map((item, i) => (
                <figure key={i}>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-neutral-100">
                    <Image src={item.url} alt={item.alt || post.title} fill className="object-cover" />
                  </div>
                  {item.caption && (
                    <figcaption className="mt-2 text-xs text-neutral-400">{item.caption}</figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}

          {post.tags.length > 0 && (
            <div className="mt-14 flex flex-wrap gap-2 border-t border-neutral-100 pt-6">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] text-neutral-500">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
