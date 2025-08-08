// Price service for fetching cryptocurrency prices
export interface PriceData {
  hbarUsd: number;
  timestamp: number;
}

let cachedPrice: PriceData | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const fetchHBARPrice = async (): Promise<number> => {
  // Check cache first
  if (cachedPrice && Date.now() - cachedPrice.timestamp < CACHE_DURATION) {
    return cachedPrice.hbarUsd;
  }

  try {
    // Try CoinGecko API first
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=hedera-hashgraph&vs_currencies=usd'
    );
    
    if (response.ok) {
      const data = await response.json();
      const price = data['hedera-hashgraph']?.usd;
      
      if (price) {
        cachedPrice = {
          hbarUsd: price,
          timestamp: Date.now()
        };
        return price;
      }
    }
  } catch (error) {
    console.warn('CoinGecko API failed, trying fallback:', error);
  }

  try {
    // Fallback to CoinCap API
    const response = await fetch('https://api.coincap.io/v2/assets/hedera-hashgraph');
    
    if (response.ok) {
      const data = await response.json();
      const price = parseFloat(data.data?.priceUsd);
      
      if (price) {
        cachedPrice = {
          hbarUsd: price,
          timestamp: Date.now()
        };
        return price;
      }
    }
  } catch (error) {
    console.warn('CoinCap API failed:', error);
  }

  // Fallback to a reasonable default if APIs fail
  console.warn('All price APIs failed, using fallback price');
  return 0.05; // Fallback HBAR price in USD
};

export const formatPriceInUSD = (hbarAmount: number, hbarPrice: number): string => {
  const usdValue = hbarAmount * hbarPrice;
  
  if (usdValue < 1) {
    return `$${usdValue.toFixed(4)}`;
  } else if (usdValue < 1000) {
    return `$${usdValue.toFixed(2)}`;
  } else {
    return `$${usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
};

export const convertHBARToUSD = (hbarAmount: string | number, hbarPrice: number): number => {
  const hbarValue = typeof hbarAmount === 'string' ? parseFloat(hbarAmount) : hbarAmount;
  return hbarValue * hbarPrice;
};
