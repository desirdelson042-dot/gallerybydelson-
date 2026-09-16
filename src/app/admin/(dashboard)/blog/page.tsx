"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/database.types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SortableList } from "@/components/ui/SortableList";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type BlogPost = Tables<"blog_posts">;

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const confirm = useConfirm();
  const supabase = createClient();

  async function load() {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .order("sort_order")
      .order("created_at", { ascending: false });
    setPosts(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function persistOrder(items: BlogPost[]) {
    setPosts(items);
    await Promise.all(
      items.map((p, i) => supabase.from("blog_posts").update({ sort_order: i }).eq("id", p.id)),
    );
  }

  async function toggleStatus(post: BlogPost) {
    const nextStatus = post.status === "published" ? "draft" : "published";
    const fields: Partial<BlogPost> = { status: nextStatus };
    if (nextStatus === "published" && !post.published_at) {
      fields.published_at = new Date().toISOString();
    }
    setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, ...fields } : p)));
    const { error } = await supabase.from("blog_posts").update(fields).eq("id", post.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(nextStatus === "published" ? "Post published" : "Post moved to draft");
  }

  async function toggleFeatured(post: BlogPost) {
    setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, featured: !p.featured } : p)));
    await supabase.from("blog_posts").update({ featured: !post.featured }).eq("id", post.id);
  }

  async function deletePost(post: BlogPost) {
    const ok = await confirm({
      title: `Delete "${post.title}"?`,
      description: "This permanently deletes the post. This cannot be undone.",
      confirmLabel: "Delete",
      danger: true,
    });
    if (!ok) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", post.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setPosts((prev) => prev.filter((p) => p.id !== post.id));
    toast.success("Post deleted");
  }

  if (loading) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Blog</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage articles. Drag to reorder — this controls the order featured posts appear on the homepage.
          </p>
        </div>
        <Link href="/admin/blog/new">
          <Button variant="primary">+ New post</Button>
        </Link>
      </div>

      <Card>
        {posts.length === 0 ? (
          <p className="text-sm text-neutral-400">No posts yet. Create your first one.</p>
        ) : (
          <SortableList
            items={posts}
            onReorder={persistOrder}
            renderItem={(post) => (
              <div className="flex items-center gap-3 rounded-md border border-neutral-200 p-3">
                <div className="h-14 w-20 shrink-0 overflow-hidden rounded-md bg-neutral-100">
                  {post.cover_image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.cover_image_url} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">{post.title}</p>
                    {post.featured && <span className="text-amber-500" title="Featured">★</span>}
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                        post.status === "published"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-neutral-100 text-neutral-500",
                      )}
                    >
                      {post.status}
                    </span>
                  </div>
                  {post.categories.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {post.categories.map((c) => (
                        <span
                          key={c}
                          className="rounded-full border border-neutral-200 px-2 py-0.5 text-[10px] text-neutral-500"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button variant="ghost" onClick={() => toggleFeatured(post)}>
                    {post.featured ? "Unfeature" : "Feature"}
                  </Button>
                  <Button variant="secondary" onClick={() => toggleStatus(post)}>
                    {post.status === "published" ? "Unpublish" : "Publish"}
                  </Button>
                  <Link href={`/admin/blog/${post.id}`}>
                    <Button variant="secondary">Edit</Button>
                  </Link>
                  <Button variant="danger" onClick={() => deletePost(post)}>
                    Delete
                  </Button>
                </div>
              </div>
            )}
          />
        )}
      </Card>
    </div>
  );
}
