export const CONFIG = {
  apiKey:      'dc05f7df3a9347378b2dff396352015c.patn2LK38cRcIp2Q',
  endpoint:    'https://api.z.ai/api/coding/paas/v4/chat/completions',
  model:       'glm-4.7',
  maxTokens:   6000,
  temperature: 0,     // 0 = greedy decoding, same resume → same scores every time
};

export const MARKETS = [
  { id: 'in',     flag: '🇮🇳', name: 'India',           short: 'India',  currency: 'INR', sym: '₹',    locale: 'en-IN' },
  { id: 'us',     flag: '🇺🇸', name: 'United States',   short: 'USA',    currency: 'USD', sym: '$',    locale: 'en-US' },
  { id: 'uk',     flag: '🇬🇧', name: 'United Kingdom',  short: 'UK',     currency: 'GBP', sym: '£',    locale: 'en-GB' },
  { id: 'de',     flag: '🇩🇪', name: 'Germany',         short: 'Germany',currency: 'EUR', sym: '€',    locale: 'de-DE' },
  { id: 'ca',     flag: '🇨🇦', name: 'Canada',          short: 'Canada', currency: 'CAD', sym: 'C$',   locale: 'en-CA' },
  { id: 'au',     flag: '🇦🇺', name: 'Australia',       short: 'Aus.',   currency: 'AUD', sym: 'A$',   locale: 'en-AU' },
  { id: 'sg',     flag: '🇸🇬', name: 'Singapore',       short: 'SG',     currency: 'SGD', sym: 'S$',   locale: 'en-SG' },
  { id: 'ae',     flag: '🇦🇪', name: 'UAE',             short: 'UAE',    currency: 'AED', sym: 'AED ', locale: 'en-AE' },
  { id: 'nl',     flag: '🇳🇱', name: 'Netherlands',     short: 'NL',     currency: 'EUR', sym: '€',    locale: 'nl-NL' },
  { id: 'remote', flag: '🌍',  name: 'Remote / Global', short: 'Global', currency: 'USD', sym: '$',    locale: 'en-US' },
];
