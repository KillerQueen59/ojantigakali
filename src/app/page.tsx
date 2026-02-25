import Desktop from "@/components/Desktop/Desktop";
import staticData from "@/data/portfolio";
import type { PortfolioData } from "@/types/portfolio";

async function fetchPortfolio(): Promise<PortfolioData | null> {
  const url = process.env.PORTFOLIO_API_URL;
  if (!url) return null;
  try {
    const res = await fetch(`${url}/portfolio`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function Page() {
  const portfolioData = await fetchPortfolio();
  // Fall back to static data when API is not configured or unreachable
  return <Desktop portfolioData={portfolioData ?? staticData} />;
}
