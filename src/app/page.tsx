import FarmExperience from "@/features/farm/FarmExperience";

// The public portfolio, revamped as a Stardew-style farm valley. Section content
// currently lives in features/farm/data/content.tsx; wire it to the portfolio API
// (the previous Desktop flow used PORTFOLIO_API_URL + src/data/portfolio) once the
// CMS fields are ready. The old Desktop components are kept in src/components for now.
export default function Page() {
  return <FarmExperience />;
}
