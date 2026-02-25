import type { Experience } from '@/types/portfolio';

export default function ExperienceWindow({
  data,
}: {
  data: Experience[] | null | undefined;
}) {
  const experiences = data ?? [];

  if (experiences.length === 0) {
    return (
      <p className="text-[var(--window-text-muted)] text-[13px] py-8 text-center">
        No experience data.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {experiences.map((exp, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-[var(--icon-accent)] shrink-0 mt-1" />
            {i < experiences.length - 1 && (
              <div className="w-0.5 flex-1 bg-[var(--window-titlebar-border)] mt-1.5" />
            )}
          </div>

          <div className="flex-1 pb-2">
            <h3 className="text-[15px] font-bold text-[var(--window-text)] tracking-tight">
              {exp.role}
            </h3>
            <div className="flex gap-2.5 mt-0.5 text-xs text-[var(--window-text-muted)] flex-wrap items-center">
              <span className="font-semibold text-[var(--icon-accent)]">
                {exp.company}
              </span>
              <span className="w-1 h-1 rounded-full bg-[var(--window-text-muted)]" />
              <span>{exp.period}</span>
              <span className="w-1 h-1 rounded-full bg-[var(--window-text-muted)]" />
              <span>{exp.location}</span>
            </div>
            <ul className="mt-2.5 flex flex-col gap-1.5">
              {exp.points.map((point, j) => (
                <li
                  key={j}
                  className="text-[13px] text-[var(--window-text)] leading-relaxed pl-3.5 relative"
                >
                  <span className="absolute left-0.5 top-[0.5em] w-1 h-1 rounded-full bg-[var(--window-text-muted)]" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
