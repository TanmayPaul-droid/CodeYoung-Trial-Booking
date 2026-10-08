export const POPULAR_TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (US & Canada)', region: 'North America', offset: 'UTC-4/UTC-5' },
  { value: 'America/Chicago', label: 'Central Time (US & Canada)', region: 'North America', offset: 'UTC-5/UTC-6' },
  { value: 'America/Denver', label: 'Mountain Time (US & Canada)', region: 'North America', offset: 'UTC-6/UTC-7' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada)', region: 'North America', offset: 'UTC-7/UTC-8' },
  { value: 'Europe/London', label: 'London, Dublin, Edinburgh (GMT/BST)', region: 'Europe', offset: 'UTC+0/UTC+1' },
  { value: 'Europe/Berlin', label: 'Berlin, Paris, Rome, Madrid (CET/CEST)', region: 'Europe', offset: 'UTC+1/UTC+2' },
  { value: 'Asia/Dubai', label: 'Dubai, Abu Dhabi, Muscat (GST)', region: 'Middle East', offset: 'UTC+4' },
  { value: 'Asia/Kolkata', label: 'India Standard Time (IST)', region: 'Asia', offset: 'UTC+5:30' },
  { value: 'Asia/Singapore', label: 'Singapore, Kuala Lumpur, Hong Kong (SGT)', region: 'Asia', offset: 'UTC+8' },
  { value: 'Asia/Tokyo', label: 'Tokyo, Seoul (JST/KST)', region: 'Asia', offset: 'UTC+9' },
  { value: 'Australia/Sydney', label: 'Sydney, Melbourne, Canberra (AEST/AEDT)', region: 'Australia', offset: 'UTC+10/UTC+11' },
  { value: 'Pacific/Auckland', label: 'Auckland, Wellington (NZST/NZDT)', region: 'Pacific', offset: 'UTC+12/UTC+13' },
];

export const ALL_IANA_TIMEZONES = [
  ...POPULAR_TIMEZONES,
  { value: 'America/Toronto', label: 'Toronto (EDT/EST)', region: 'North America' },
  { value: 'America/Vancouver', label: 'Vancouver (PDT/PST)', region: 'North America' },
  { value: 'America/Phoenix', label: 'Phoenix (MST, no DST)', region: 'North America' },
  { value: 'America/Sao_Paulo', label: 'São Paulo, Brazil', region: 'South America' },
  { value: 'Europe/Amsterdam', label: 'Amsterdam (CET/CEST)', region: 'Europe' },
  { value: 'Europe/Zurich', label: 'Zurich (CET/CEST)', region: 'Europe' },
  { value: 'Asia/Riyadh', label: 'Riyadh, Saudi Arabia (AST)', region: 'Middle East' },
  { value: 'Asia/Bangkok', label: 'Bangkok, Jakarta, Hanoi (ICT)', region: 'Asia' },
  { value: 'Asia/Shanghai', label: 'Shanghai, Beijing (CST)', region: 'Asia' },
  { value: 'Australia/Perth', label: 'Perth (AWST)', region: 'Australia' },
  { value: 'UTC', label: 'Coordinated Universal Time (UTC)', region: 'Universal' },
];
