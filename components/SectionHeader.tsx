export default function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {subtitle ? <p className="text-gray-600">{subtitle}</p> : null}
    </div>
  );
}
