export function CustomSection({ title, body }: { title: string; body: string | null }) {
  if (!body) return null;
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mt-4 whitespace-pre-line text-neutral-600">{body}</p>
    </section>
  );
}
