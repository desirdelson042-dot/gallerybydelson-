import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Tables } from "@/lib/database.types";

export type HeroContent = Tables<"hero_content">;
export type HeroImage = Tables<"hero_images">;
export type HeroTextBlock = Tables<"hero_text_blocks">;

const HEIGHT_MAP: Record<string, string> = {
  small: "min-h-[45vh]",
  medium: "min-h-[65vh]",
  large: "min-h-[85vh]",
  fullscreen: "min-h-screen",
};

const WIDTH_MAP: Record<string, string> = {
  contained: "max-w-5xl",
  wide: "max-w-7xl",
  full: "max-w-none",
};

const PADDING_MAP: Record<string, string> = {
  tight: "py-8 px-4",
  normal: "py-16 px-6",
  loose: "py-28 px-8",
};

const SPACING_MAP: Record<string, string> = {
  tight: "mb-0",
  normal: "mb-16",
  loose: "mb-32",
};

const ALIGN_MAP: Record<string, string> = {
  left: "text-left items-start",
  center: "text-center items-center",
  right: "text-right items-end",
};

const POSITION_MAP: Record<string, string> = {
  "top-left": "justify-start items-start text-left",
  "top-center": "justify-start items-center text-center",
  "top-right": "justify-start items-end text-right",
  center: "justify-center items-center text-center",
  "bottom-left": "justify-end items-start text-left",
  "bottom-center": "justify-end items-center text-center",
  "bottom-right": "justify-end items-end text-right",
};

export function Hero({
  content,
  images,
  textBlocks,
}: {
  content: HeroContent;
  images: HeroImage[];
  textBlocks: HeroTextBlock[];
}) {
  const primaryImage = images.find((i) => i.is_primary) ?? images[0];
  const extraBlocks = [...textBlocks].filter((b) => b.visible).sort((a, b) => a.sort_order - b.sort_order);
  const hasBgMedia = content.background_type === "image" || content.background_type === "video";
  const overlayStyle =
    content.overlay_enabled
      ? {
          backgroundColor: content.overlay_color,
          opacity: content.overlay_opacity,
        }
      : undefined;

  const bgStyle: React.CSSProperties =
    content.background_type === "solid"
      ? { backgroundColor: content.bg_color }
      : content.background_type === "gradient"
        ? {
            backgroundImage: `linear-gradient(${content.gradient_direction}, ${content.bg_color}, ${content.bg_color_secondary})`,
          }
        : {};

  const isOverlayLayout = content.desktop_layout === "overlay" || content.image_position === "background";

  const textContent = (
    <div className={cn("flex flex-col gap-4", ALIGN_MAP[content.text_alignment] ?? ALIGN_MAP.left)}>
      {content.title_visible && content.title && (
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">{content.title}</h1>
      )}
      {content.subtitle_visible && content.subtitle && (
        <p className="text-lg text-neutral-500 sm:text-xl">{content.subtitle}</p>
      )}
      {content.description_visible && content.description && (
        <p className="max-w-xl text-base text-neutral-500">{content.description}</p>
      )}
      {extraBlocks.map((block) => (
        <p key={block.id} className="text-base text-neutral-500">
          {block.content}
        </p>
      ))}
      {content.cta_enabled && content.cta_text && (
        <a
          href={content.cta_url || "#"}
          className="mt-2 inline-flex w-fit items-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
        >
          {content.cta_text}
        </a>
      )}
    </div>
  );

  const imageBlock = primaryImage ? (
    <div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl bg-neutral-100">
      <Image
        src={primaryImage.url}
        alt={primaryImage.alt_text}
        fill
        unoptimized
        className="object-cover"
        style={{
          objectPosition: primaryImage.object_position,
          objectFit: primaryImage.object_fit as "cover" | "contain",
          transform: `scale(${primaryImage.scale})`,
        }}
      />
      {primaryImage.caption && (
        <span className="absolute bottom-3 left-3 rounded bg-black/50 px-2 py-1 text-xs text-white">
          {primaryImage.caption}
        </span>
      )}
    </div>
  ) : null;

  return (
    <section
      className={cn("relative w-full overflow-hidden", SPACING_MAP[content.section_spacing] ?? SPACING_MAP.normal, HEIGHT_MAP[content.hero_height] ?? HEIGHT_MAP.large)}
      style={bgStyle}
    >
      {hasBgMedia && (
        <div className="absolute inset-0">
          {content.background_type === "video" && content.bg_video_url ? (
            <video
              src={content.bg_video_url}
              autoPlay
              muted
              loop
              playsInline
              className={cn("hidden h-full w-full md:block", content.bg_size === "contain" ? "object-contain" : "object-cover")}
              style={{ objectPosition: content.bg_image_object_position, filter: `blur(${content.blur}px) brightness(${content.brightness})` }}
            />
          ) : content.bg_image_url ? (
            <img
              src={content.bg_image_url}
              alt=""
              className={cn("hidden h-full w-full md:block", content.bg_size === "contain" ? "object-contain" : "object-cover")}
              style={{
                objectPosition: content.bg_image_object_position,
                transform: `scale(${content.bg_image_scale})`,
                filter: `blur(${content.blur}px) brightness(${content.brightness})`,
              }}
            />
          ) : null}
          {(content.mobile_bg_image_url || content.mobile_bg_video_url) &&
            (content.background_type === "video" && content.mobile_bg_video_url ? (
              <video
                src={content.mobile_bg_video_url}
                autoPlay
                muted
                loop
                playsInline
                className="block h-full w-full object-cover md:hidden"
              />
            ) : content.mobile_bg_image_url ? (
              <img src={content.mobile_bg_image_url} alt="" className="block h-full w-full object-cover md:hidden" />
            ) : null)}
        </div>
      )}
      {content.overlay_enabled && <div className="absolute inset-0" style={overlayStyle} />}

      {isOverlayLayout ? (
        <div className={cn("relative z-10 mx-auto flex h-full w-full", WIDTH_MAP[content.content_width], PADDING_MAP[content.padding])}>
          <div className={cn("flex w-full flex-col", POSITION_MAP[content.text_position] ?? POSITION_MAP["bottom-left"])}>
            {textContent}
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "relative z-10 mx-auto grid w-full items-center gap-10",
            WIDTH_MAP[content.content_width],
            PADDING_MAP[content.padding],
            content.desktop_layout === "stacked" || content.image_position === "none"
              ? "grid-cols-1"
              : "grid-cols-1 md:grid-cols-2",
            content.image_position === "left" && "md:[&>*:first-child]:order-2",
          )}
        >
          <div className="flex flex-col justify-center">{textContent}</div>
          {content.image_position !== "none" && imageBlock}
        </div>
      )}
    </section>
  );
}
