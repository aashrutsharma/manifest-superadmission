export type StreamType =
  | 'Engineering'
  | 'Medical'
  | 'Management'
  | 'Law'
  | 'Arts & Science'
  | 'Design'
  | 'Pharmacy'
  | 'Commerce'
  | 'Architecture'
  | 'Agriculture'
  | 'Dental'
  | 'Nursing'
  | 'Hotel Management'
  | 'Mass Communication'
  | 'Paramedical'
  | 'Other';

export type UniversityType =
  | 'IIT'
  | 'NIT'
  | 'IIIT'
  | 'IIM'
  | 'AIIMS'
  | 'Central University'
  | 'State Govt'
  | 'Private Deemed'
  | 'Private University'
  | 'Autonomous'
  | 'Affiliated College'
  | 'Other';

export type OwnershipType = 'Public' | 'Private' | 'Public-Private' | 'Government' | 'Other';

export type NaacGrade = 'A++' | 'A+' | 'A' | 'B++' | 'B+' | 'B' | 'C' | 'NA';

export interface Course {
  id: string;
  name: string;
  degree: string;
  stream: StreamType | string;
  duration: string;
  annualFee: number;
  seats: number;
  eligibility: string;
  exam: string;
}

export interface College {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  code?: string;
  universityType: UniversityType | string;
  ownership: OwnershipType | string;
  establishedYear: number;
  genderType: 'Co-ed' | 'Women Only' | string;
  
  // Location
  state: string;
  city: string;
  district?: string;
  pincode?: string;
  address: string;
  campusAreaAcres: number;
  
  // Accreditations & Rankings
  naacGrade: NaacGrade | string;
  naacCgpa?: number;
  nirfOverallRank?: number;
  nirfStreamRank?: {
    stream: string;
    rank: number;
  };
  approvals: string[];
  affiliatingUniversity?: string;
  
  // Academics & Finances
  streams: (StreamType | string)[];
  levels: ('UG' | 'PG' | 'Diploma' | 'Ph.D' | string)[];
  avgAnnualFeeMin: number;
  avgAnnualFeeMax: number;
  medianPackageLpa: number;
  highestPackageLpa: number;
  topRecruiters: string[];
  examsAccepted: string[];
  
  // Details
  description: string;
  website: string;
  phone: string;
  email: string;
  facilities: string[];
  courses: Course[];
  
  isVerified: boolean;
  isFeatured?: boolean;
}

export interface FilterState {
  searchQuery: string;
  selectedStates: string[];
  selectedStreams: (StreamType | string)[];
  selectedTypes: (UniversityType | string)[];
  selectedOwnership: (OwnershipType | string)[];
  selectedNaac: (NaacGrade | string)[];
  minNirfRank?: number;
  maxNirfRank?: number;
  maxAnnualFee?: number;
  minPackageLpa?: number;
  genderType?: 'All' | 'Co-ed' | 'Women Only';
  sortBy: 'nirf' | 'package_desc' | 'fee_asc' | 'fee_desc' | 'established' | 'name';
  page: number;
  pageSize: number;
}
