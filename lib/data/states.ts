export interface StateData {
  name: string;
  code: string;
  zone: 'North' | 'South' | 'West' | 'East' | 'Central' | 'North-East';
  collegeCountEstimate: number;
}

export const INDIAN_STATES: StateData[] = [
  { name: 'Maharashtra', code: 'MH', zone: 'West', collegeCountEstimate: 7850 },
  { name: 'Tamil Nadu', code: 'TN', zone: 'South', collegeCountEstimate: 6920 },
  { name: 'Karnataka', code: 'KA', zone: 'South', collegeCountEstimate: 5840 },
  { name: 'Uttar Pradesh', code: 'UP', zone: 'North', collegeCountEstimate: 9210 },
  { name: 'Delhi NCR', code: 'DL', zone: 'North', collegeCountEstimate: 2450 },
  { name: 'Telangana', code: 'TS', zone: 'South', collegeCountEstimate: 4120 },
  { name: 'Andhra Pradesh', code: 'AP', zone: 'South', collegeCountEstimate: 4350 },
  { name: 'Gujarat', code: 'GJ', zone: 'West', collegeCountEstimate: 3600 },
  { name: 'West Bengal', code: 'WB', zone: 'East', collegeCountEstimate: 4180 },
  { name: 'Rajasthan', code: 'RJ', zone: 'North', collegeCountEstimate: 3950 },
  { name: 'Kerala', code: 'KL', zone: 'South', collegeCountEstimate: 3200 },
  { name: 'Madhya Pradesh', code: 'MP', zone: 'Central', collegeCountEstimate: 4100 },
  { name: 'Punjab', code: 'PB', zone: 'North', collegeCountEstimate: 2300 },
  { name: 'Haryana', code: 'HR', zone: 'North', collegeCountEstimate: 2150 },
  { name: 'Bihar', code: 'BR', zone: 'East', collegeCountEstimate: 3100 },
  { name: 'Odisha', code: 'OD', zone: 'East', collegeCountEstimate: 2420 },
  { name: 'Uttarakhand', code: 'UK', zone: 'North', collegeCountEstimate: 1200 },
  { name: 'Assam', code: 'AS', zone: 'North-East', collegeCountEstimate: 1450 },
  { name: 'Jharkhand', code: 'JH', zone: 'East', collegeCountEstimate: 1380 },
  { name: 'Chhattisgarh', code: 'CG', zone: 'Central', collegeCountEstimate: 1420 },
  { name: 'Himachal Pradesh', code: 'HP', zone: 'North', collegeCountEstimate: 850 },
  { name: 'Jammu & Kashmir', code: 'JK', zone: 'North', collegeCountEstimate: 620 },
  { name: 'Goa', code: 'GA', zone: 'West', collegeCountEstimate: 290 },
  { name: 'Chandigarh', code: 'CH', zone: 'North', collegeCountEstimate: 180 },
  { name: 'Puducherry', code: 'PY', zone: 'South', collegeCountEstimate: 210 },
  { name: 'Meghalaya', code: 'ML', zone: 'North-East', collegeCountEstimate: 190 },
  { name: 'Manipur', code: 'MN', zone: 'North-East', collegeCountEstimate: 160 },
  { name: 'Tripura', code: 'TR', zone: 'North-East', collegeCountEstimate: 140 },
  { name: 'Sikkim', code: 'SK', zone: 'North-East', collegeCountEstimate: 95 },
  { name: 'Nagaland', code: 'NL', zone: 'North-East', collegeCountEstimate: 80 },
  { name: 'Arunachal Pradesh', code: 'AR', zone: 'North-East', collegeCountEstimate: 75 },
  { name: 'Mizoram', code: 'MZ', zone: 'North-East', collegeCountEstimate: 65 }
];

export const STREAMS_LIST = [
  'Engineering',
  'Medical',
  'Management',
  'Law',
  'Arts & Science',
  'Design',
  'Pharmacy',
  'Commerce',
  'Architecture'
] as const;

export const UNIVERSITY_TYPES_LIST = [
  'IIT',
  'NIT',
  'IIIT',
  'IIM',
  'AIIMS',
  'Central University',
  'State Govt',
  'Private Deemed',
  'Private University',
  'Autonomous'
] as const;

export const NAAC_GRADES_LIST = ['A++', 'A+', 'A', 'B++', 'B+', 'B'] as const;

