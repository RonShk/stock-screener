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

// Company Profile interface - matches FMP API response
export interface CompanyProfile {
  symbol: string;
  price: number;
  beta?: number;
  volume?: number;
  averageVolume?: number;
  marketCap?: number;
  lastDividend?: number;
  range?: string;
  change?: number;
  changePercentage?: number;
  companyName: string;
  currency?: string;
  cik?: string;
  isin?: string;
  cusip?: string;
  exchange?: string;
  exchangeFullName?: string;
  industry?: string;
  website?: string;
  description?: string;
  ceo?: string;
  sector?: string;
  country?: string;
  fullTimeEmployees?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  dcfDiff?: number;
  dcf?: number;
  image?: string;
  ipoDate?: string;
  defaultImage?: boolean;
  isEtf?: boolean;
  isActivelyTrading?: boolean;
  isAdr?: boolean;
  isFund?: boolean;
}

const BASE_URL = 'https://financialmodelingprep.com/stable';

export async function getEarningsCalendar(startDate?: Date, endDate?: Date): Promise<EarningsEntry[]> {
  const apiKey = process.env.FMP_API_KEY;
  
  if (!apiKey) {
    console.error('FMP_API_KEY is missing');
    return [];
  }

  // Default to today if no start date provided
  const start = startDate ? startDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
  
  // If no end date, default to 1 month from start
  let endStr: string;
  if (endDate) {
    endStr = endDate.toISOString().split('T')[0];
  } else {
    const d = startDate ? new Date(startDate) : new Date();
    d.setMonth(d.getMonth() + 1); // Default to 1 month view
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

export async function getCompanyProfile(symbol: string): Promise<CompanyProfile | null> {
  const apiKey = process.env.FMP_API_KEY;
  
  if (!apiKey) {
    console.error('FMP_API_KEY is missing');
    return null;
  }

  try {
    const response = await fetch(
      `${BASE_URL}/profile?symbol=${symbol}&apikey=${apiKey}`, 
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch company profile: ${response.statusText}`);
    }

    const data: CompanyProfile[] = await response.json();
    
    // API returns an array, we want the first item
    return data[0] || null;
  } catch (error) {
    console.error('Error fetching company profile:', error);
    return null;
  }
}


