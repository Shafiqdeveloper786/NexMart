"use client";

export function SortSelect({
  value,
  options,
}: {
  value: string;
  options: { value: string; label: string }[];
}) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const url = new URL(window.location.href);
    url.searchParams.set("sort", e.target.value);
    window.location.href = url.toString();
  };

  return (
    <select
      defaultValue={value}
      onChange={handleChange}
      className="px-3 py-2 rounded-xl border border-border bg-background text-sm font-medium text-foreground focus:outline-none focus:border-foreground cursor-pointer transition-colors"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
