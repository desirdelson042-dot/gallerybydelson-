"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { toSlug } from "@/lib/slug";
import type { Json, Tables } from "@/lib/database.types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { GalleryManager, type GalleryEntry } from "@/components/admin/blog/GalleryManager";

type BlogPost = Tables<"blog_posts">;

function parseGallery(value: Json): GalleryEntry[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is Record<string, Json> => typeof item === "object" && item !== null && !Array.isArray(item))
    .map((item) => ({
      url: typeof item.url === "string" ? item.url : "",
      alt: typeof item.alt === "string" ? item.alt : "",
      caption: typeof item.caption === "string" ? item.caption : "",
    }));
}

function joinList(value: string[] | null | undefined) {
  return (value ?? []).join(", ");
}

function splitList(value: string) {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export function BlogPostForm({
  mode,
  initialPost,
}: {
  mode: "create" | "edit";
  initialPost?: BlogPost;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [slug, setSlug] = useState(initialPost?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt ?? "");
  const [content, setContent] = useState(initialPost?.content ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(initialPost?.cover_image_url ?? "");
  const [gallery, setGallery] = useState<GalleryEntry[]>(() => parseGallery(initialPost?.gallery ?? []));
  const [categories, setCategories] = useState(joinList(initialPost?.categories));
  const [tags, setTags] = useState(joinList(initialPost?.tags));
  const [status, setStatus] = useState(initialPost?.status ?? "draft");
  const [featured, setFeatured] = useState(initialPost?.featured ?? false);
  const [seoTitle, setSeoTitle] = useState(initialPost?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(initialPost?.seo_description ?? "");
  const [saving, setSaving] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(toSlug(value));
  }

  async function save() {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!slug.trim()) {
      toast.error("Slug is required");
      return;
    }

    setSaving(true);

    const payload = {
      title: title.trim(),
      slug: toSlug(slug),
      excerpt,
      content,
      cover_image_url: coverImageUrl || null,
      gallery: gallery as unknown as Json,
      categories: splitList(categories),
      tags: splitList(tags),
      status,
      featured,
      seo_title: seoTitle,
      seo_description: seoDescription,
    };

    if (mode === "create") {
      const insertPayload = {
        ...payload,
        published_at: status === "published" ? new Date().toISOString() : null,
      };
      const { data, error } = await supabase.from("blog_posts").insert(insertPayload).select().single();
      setSaving(false);
      if (error) {
        if (error.code === "23505") {
          toast.error("That slug is already in use. Choose a different one.");
        } else {
          toast.error(error.message);
        }
        return;
      }
      toast.success("Post created");
      router.push(`/admin/blog/${data.id}`);
      return;
    }

    if (!initialPost) return;

    const updatePayload: Partial<BlogPost> = { ...payload };
    if (status === "published" && !initialPost.published_at) {
      updatePayload.published_at = new Date().toISOString();
    }

    const { error } = await supabase.from("blog_posts").update(updatePayload).eq("id", initialPost.id);
    setSaving(false);
    if (error) {
      if (error.code === "23505") {
        toast.error("That slug is already in use. Choose a different one.");
      } else {
        toast.error(error.message);
      }
      return;
    }
    toast.success("Saved");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">{mode === "create" ? "New post" : "Edit post"}</h1>
        <p className="mt-1 text-sm text-neutral-500">
          {mode === "create" ? "Write a new blog article." : "Update this blog article."}
        </p>
      </div>

      <Card className="space-y-4">
        <h2 className="text-sm font-semibold">Content</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Title">
            <Input value={title} onChange={(e) => handleTitleChange(e.target.value)} />
          </Field>
          <Field label="Slug" hint="Used in the URL: /blog/your-slug">
            <Input
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
            />
          </Field>
        </div>
        <Field label="Excerpt">
          <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
        </Field>
        <Field label="Content" hint="Plain text or simple markdown-style formatting.">
          <Textarea className="min-h-96" rows={16} value={content} onChange={(e) => setContent(e.target.value)} />
        </Field>
        <Field label="Cover image">
          <ImagePicker value={coverImageUrl} onChange={setCoverImageUrl} label="Choose cover image" />
        </Field>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-sm font-semibold">Gallery</h2>
        <GalleryManager value={gallery} onChange={setGallery} />
      </Card>

      <Card className="space-y-4">
        <h2 className="text-sm font-semibold">Organization</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Categories" hint="Comma-separated">
            <Input value={categories} onChange={(e) => setCategories(e.target.value)} />
          </Field>
          <Field label="Tags" hint="Comma-separated">
            <Input value={tags} onChange={(e) => setTags(e.target.value)} />
          </Field>
        </div>
        <div className="flex items-center gap-6">
          <Field label="Status" className="w-40">
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </Select>
          </Field>
          <div className="pt-5">
            <Switch checked={featured} onChange={setFeatured} label="Featured" />
          </div>
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-sm font-semibold">SEO</h2>
        <Field label="SEO title" hint="Falls back to the post title">
          <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
        </Field>
        <Field label="SEO description" hint="Falls back to the excerpt">
          <Textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} />
        </Field>
      </Card>

      <div className="flex justify-end">
        <Button variant="primary" onClick={save} disabled={saving}>
          {saving ? "Saving…" : mode === "create" ? "Create post" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
