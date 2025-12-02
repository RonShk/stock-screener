// Raw API response from FMP
interface FMPEarningsResponse {
  symbol: string;
  date: string;
  epsActual: number | null;
  epsEstimated: number | null;
  revenueActual: number | null;
  revenueEstimated: number | null;
  lastUpdated: string;
}

// Mapped interface for our application
export interface EarningsEntry {
  date: string;
  symbol: string;
  epsActual: number | null;
  epsEstimated: number | null;
  revenueActual: number | null;
  revenueEstimated: number | null;
  lastUpdated: string;
  time?: 'bmo' | 'amc' | 'ime'; // Optional - not always provided by API
  fiscalDateEnding?: string; // Optional - not always provided by API
}

const BASE_URL = 'https://financialmodelingprep.com/stable';

export async function getEarningsCalendar(startDate?: Date, endDate?: Date): Promise<EarningsEntry[]> {
  const apiKey = process.env.FMP_API_KEY;
  
  if (!apiKey) {
    console.error('FMP_API_KEY is missing');
    return [];
  }

  // Default to upcoming week if no dates provided
  const start = startDate ? startDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
  
  // If no end date, default to 7 days from start
  let endStr: string;
  if (endDate) {
    endStr = endDate.toISOString().split('T')[0];
  } else {
    const d = startDate ? new Date(startDate) : new Date();
    d.setDate(d.getDate() + 14); // Default to 2 weeks view
    endStr = d.toISOString().split('T')[0];
  }

  try {
    const response = await fetch(
      `${BASE_URL}/earnings-calendar?from=${start}&to=${endStr}&apikey=${apiKey}`, 
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch earnings: ${response.statusText}`);
    }

    const data: FMPEarningsResponse[] = await response.json();
    
    // Map API response to our EarningsEntry interface
    const mappedData: EarningsEntry[] = data.map((item) => ({
      date: item.date,
      symbol: item.symbol,
      epsActual: item.epsActual ?? null,
      epsEstimated: item.epsEstimated ?? null,
      revenueActual: item.revenueActual ?? null,
      revenueEstimated: item.revenueEstimated ?? null,
      lastUpdated: item.lastUpdated,
      // time and fiscalDateEnding are optional and not in this API response
    }));
    
    // FMP sometimes returns mixed sorts, let's sort by date
    return mappedData.sort((a: EarningsEntry, b: EarningsEntry) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  } catch (error) {
    console.error('Error fetching earnings calendar:', error);
    return [];
  }
}






