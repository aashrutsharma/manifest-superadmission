import { College } from './types';

export interface EducationHub {
  id: string;
  name: string;
  shortName: string;
  count: number;
  center: [number, number];
  zoom: number;
  description: string;
}

export const EDUCATION_HUBS: EducationHub[] = [
  {
    id: 'ncr',
    name: 'NCR Academic Hub',
    shortName: 'Delhi-NCR',
    count: 2450,
    center: [28.6139, 77.2090],
    zoom: 11,
    description: 'Delhi, Noida, Gurugram & Faridabad higher education cluster',
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru Silicon Hub',
    shortName: 'Bengaluru',
    count: 1840,
    center: [12.9716, 77.5946],
    zoom: 11,
    description: 'India\'s deep-tech, AI, and premier research ecosystem',
  },
  {
    id: 'mumbai-pune',
    name: 'Mumbai-Pune Corridor',
    shortName: 'Mumbai-Pune',
    count: 2890,
    center: [18.7500, 73.3000],
    zoom: 9,
    description: 'Western industrial, financial, and engineering corridor',
  },
  {
    id: 'tamil-nadu',
    name: 'Tamil Nadu Belt',
    shortName: 'TN Engineering Arc',
    count: 3200,
    center: [12.5000, 79.5000],
    zoom: 8,
    description: 'Highest density of accredited technical universities in Asia',
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad Innovation Belt',
    shortName: 'Hyderabad',
    count: 1420,
    center: [17.3850, 78.4867],
    zoom: 11,
    description: 'HITEC City tech, pharmaceutical, and genomics institutions',
  },
];

export const CITY_COORDINATES: Record<string, [number, number]> = {
  // Metros & Major Hubs
  delhi: [28.6139, 77.2090],
  'new delhi': [28.5672, 77.2100],
  noida: [28.5355, 77.3910],
  gurugram: [28.4595, 77.0266],
  gurgaon: [28.4595, 77.0266],
  faridabad: [28.4089, 77.3178],
  bengaluru: [12.9716, 77.5946],
  bangalore: [12.9716, 77.5946],
  mumbai: [19.0760, 72.8777],
  pune: [18.5204, 73.8567],
  chennai: [13.0827, 80.2707],
  hyderabad: [17.3850, 78.4867],
  kolkata: [22.5726, 88.3639],
  ahmedabad: [23.0225, 72.5714],
  kanpur: [26.4499, 80.3319],
  kharagpur: [22.3460, 87.2320],
  roorkee: [29.8543, 77.8880],
  guwahati: [26.1445, 91.7362],
  varanasi: [25.3176, 82.9739],
  pilani: [28.3670, 75.6033],
  chandigarh: [30.7333, 76.7794],
  patiala: [30.3564, 76.3647],
  jaipur: [26.9124, 75.7873],
  lucknow: [26.8467, 80.9462],
  bhopal: [23.2599, 77.4126],
  indore: [22.7196, 75.8577],
  coimbatore: [11.0168, 76.9558],
  trichy: [10.7905, 78.7047],
  tiruchirappalli: [10.7905, 78.7047],
  vellore: [12.9165, 79.1325],
  manipal: [13.3525, 74.7865],
  thiruvananthapuram: [8.5241, 76.9366],
  kochi: [9.9312, 76.2673],
  calicut: [11.2588, 75.7804],
  bhubaneswar: [20.2961, 85.8245],
  patna: [25.5941, 85.1376],
  ranchi: [23.3441, 85.3096],
  dehradun: [30.3165, 78.0322],
  shimla: [31.1048, 77.1734],
  srinagar: [34.0837, 74.7973],
  jammu: [32.7266, 74.8570],
  goa: [15.2993, 74.1240],
  nagpur: [21.1458, 79.0882],
  surat: [21.1702, 72.8311],
  vadodara: [22.3072, 73.1812],
  visakhapatnam: [17.6868, 83.2185],
  vijayawada: [16.5062, 80.6480],
  mangalore: [12.9141, 74.8560],
  mysuru: [12.2958, 76.6394],
  mysore: [12.2958, 76.6394],
  amritsar: [31.6340, 74.8723],
  jalandhar: [31.3260, 75.5762],
  rourkela: [22.2531, 84.9011],
};

export function getCollegeCoordinates(college: College): [number, number] {
  if (college.lat && college.lng) {
    return [college.lat, college.lng];
  }

  const cityKey = (college.city || '').trim().toLowerCase();
  if (CITY_COORDINATES[cityKey]) {
    // Add micro-jitter if multiple colleges in same city so markers don't overlap completely
    const base = CITY_COORDINATES[cityKey];
    const hash = (college.id || college.name).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const jitterLat = ((hash % 17) - 8) * 0.004;
    const jitterLng = (((hash * 7) % 17) - 8) * 0.004;
    return [base[0] + jitterLat, base[1] + jitterLng];
  }

  // State fallbacks
  const state = (college.state || '').toLowerCase();
  if (state.includes('tamil nadu')) return [11.1271, 78.6569];
  if (state.includes('karnataka')) return [15.3173, 75.7139];
  if (state.includes('maharashtra')) return [19.7515, 75.7139];
  if (state.includes('delhi')) return [28.6139, 77.2090];
  if (state.includes('uttar pradesh')) return [26.8467, 80.9462];
  if (state.includes('west bengal')) return [22.9868, 87.8550];
  if (state.includes('gujarat')) return [22.2587, 71.1924];
  if (state.includes('rajasthan')) return [27.0238, 74.2179];
  if (state.includes('kerala')) return [10.8505, 76.2711];
  if (state.includes('telangana')) return [18.1124, 79.0193];
  if (state.includes('andhra')) return [15.9129, 79.7400];
  if (state.includes('punjab')) return [31.1471, 75.3412];
  if (state.includes('odisha')) return [20.9517, 85.0985];
  if (state.includes('madhya')) return [22.9734, 78.6569];
  if (state.includes('assam')) return [26.2006, 92.9376];
  if (state.includes('uttarakhand')) return [30.0668, 79.0193];

  return [20.5937, 78.9629]; // Center of India fallback
}

export function inferEducationHub(college: College): string {
  if (college.hub) return college.hub;

  const city = (college.city || '').toLowerCase();
  const state = (college.state || '').toLowerCase();

  if (city.includes('delhi') || city.includes('noida') || city.includes('gurugram') || city.includes('faridabad')) {
    return 'NCR Academic Hub';
  }
  if (city.includes('bengaluru') || city.includes('bangalore')) {
    return 'Bengaluru Silicon Hub';
  }
  if (city.includes('mumbai') || city.includes('pune') || city.includes('thane') || city.includes('navi mumbai')) {
    return 'Mumbai-Pune Corridor';
  }
  if (state.includes('tamil nadu') || city.includes('chennai') || city.includes('vellore') || city.includes('trichy') || city.includes('coimbatore')) {
    return 'Tamil Nadu Belt';
  }
  if (city.includes('hyderabad') || state.includes('telangana')) {
    return 'Hyderabad Innovation Belt';
  }

  return 'Other Regional Center';
}

