import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export async function Services() {
  const supabase = await createClient();
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("visible", true)
    .order("sort_order");

  if (!services || services.length === 0) return null;

  return (
    <section id="services" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="text-3xl font-semibold">Services</h2>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex flex-col rounded-2xl border border-neutral-200 p-6"
          >
            {service.image_url ? (
              <div className="relative mb-5 aspect-video w-full overflow-hidden rounded-xl bg-neutral-100">
                <Image src={service.image_url} alt={service.title} fill unoptimized className="object-cover" />
              </div>
            ) : (
              service.icon && <span className="mb-5 text-3xl">{service.icon}</span>
            )}

            <h3 className="text-lg font-semibold">{service.title}</h3>
            {service.description && (
              <p className="mt-2 flex-1 whitespace-pre-line text-sm text-neutral-500">
                {service.description}
              </p>
            )}

            {service.cta_text && (
              <a
                href={service.cta_url || "#"}
                className="mt-6 inline-flex w-fit items-center text-sm font-medium text-neutral-900 underline underline-offset-4 transition hover:text-neutral-600"
              >
                {service.cta_text}
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
