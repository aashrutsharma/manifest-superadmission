import { supabase, isSupabaseConfigured } from './supabase';
import { College, Course, FilterState } from './types';
import { COLLEGES_DATA } from './data/colleges';
import { getCollegeCoordinates } from './geo';
import { expandSearchQuery, fuzzyMatchInstitution } from './acronyms';

function inferStreamsFromNameAndData(row: Record<string, any>): string[] {
  const streams = new Set<string>();
  const text = `${row.name || ''} ${row.stream || ''} ${row.discipline || ''} ${row.disciplines || ''} ${row.programs_offered || ''} ${row.type || ''}`.toLowerCase();

  if (row.disciplines && Array.isArray(row.disciplines)) {
    row.disciplines.forEach((d: string) => streams.add(d));
  } else if (typeof row.disciplines === 'string') {
    try {
      const parsed = JSON.parse(row.disciplines);
      if (Array.isArray(parsed)) parsed.forEach((d: string) => streams.add(d));
    } catch {
      row.disciplines.split(',').forEach((d: string) => streams.add(d.trim()));
    }
  }

  if (row.stream) {
    streams.add(String(row.stream));
  }

  if (streams.size === 0) {
    if (text.includes('engineer') || text.includes('technol') || text.includes('polytechnic') || text.includes('iit') || text.includes('nit')) {
      streams.add('Engineering');
    }
    if (text.includes('medic') || text.includes('health') || text.includes('nursing') || text.includes('hospital') || text.includes('ayush') || text.includes('dental') || text.includes('mbbs')) {
      streams.add('Medical');
    }
    if (text.includes('manage') || text.includes('business') || text.includes('mba') || text.includes('bba') || text.includes('iim')) {
      streams.add('Management');
    }
    if (text.includes('law') || text.includes('juridical') || text.includes('legal') || text.includes('llb') || text.includes('nlu')) {
      streams.add('Law');
    }
    if (text.includes('pharm') || text.includes('drug')) {
      streams.add('Pharmacy');
    }
    if (text.includes('commerc') || text.includes('account') || text.includes('b.com')) {
      streams.add('Commerce');
    }
    if (text.includes('design') || text.includes('fashion') || text.includes('nift') || text.includes('nid')) {
      streams.add('Design');
    }
    if (text.includes('architect') || text.includes('planning') || text.includes('b.arch')) {
      streams.add('Architecture');
    }
    if (text.includes('science') || text.includes('arts') || text.includes('degree college') || text.includes('university') || streams.size === 0) {
      streams.add('Arts & Science');
    }
  }

  return Array.from(streams);
}

function buildFacilitiesFromRow(row: Record<string, any>): string[] {
  const facilities: string[] = [];
  if (row.has_library) facilities.push('Central Library');
  if (row.has_boys_hostel) facilities.push('Boys Hostel');
  if (row.has_girls_hostel) facilities.push('Girls Hostel');
  if (row.has_sports_facility) facilities.push('Sports Ground / Complex');
  if (row.has_medical_facility) facilities.push('Health Care Centre');
  if (row.has_wifi) facilities.push('Campus Wi-Fi');
  if (row.is_ugc_recognized) facilities.push('UGC Recognized');
  if (row.is_aicte_approved) facilities.push('AICTE Approved');

  if (facilities.length === 0) {
    facilities.push('Central Library', 'Laboratories', 'Classrooms', 'Sports Facility', 'Computer Center');
  }
  return facilities;
}

function generateCoursesForInstitution(row: Record<string, any>, streams: string[]): Course[] {
  const courses: Course[] = [];
  const name = row.name || '';
  const primaryStream = streams[0] || 'Arts & Science';

  if (streams.includes('Engineering')) {
    courses.push({
      id: `${row.id}-cse`,
      name: 'B.Tech in Computer Science & Engineering',
      degree: 'B.Tech',
      stream: 'Engineering',
      duration: '4 Years',
      annualFee: row.avg_annual_fee_min ? Number(row.avg_annual_fee_min) * 100000 : 125000,
      seats: 120,
      eligibility: '10+2 with Physics, Mathematics & Chemistry',
      exam: row.entrance_exams_accepted || 'JEE Main / State CET',
    });
    courses.push({
      id: `${row.id}-mech`,
      name: 'B.Tech in Mechanical / Electrical / Civil Engineering',
      degree: 'B.Tech',
      stream: 'Engineering',
      duration: '4 Years',
      annualFee: row.avg_annual_fee_min ? Number(row.avg_annual_fee_min) * 100000 : 110000,
      seats: 60,
      eligibility: '10+2 with PCM',
      exam: 'State CET / JEE',
    });
  }

  if (streams.includes('Medical')) {
    courses.push({
      id: `${row.id}-med`,
      name: name.toLowerCase().includes('nursing') ? 'B.Sc Nursing' : name.toLowerCase().includes('paramedic') ? 'B.Sc Allied Health Sciences' : 'MBBS / Health Sciences',
      degree: 'UG',
      stream: 'Medical',
      duration: '4 - 5.5 Years',
      annualFee: 85000,
      seats: 100,
      eligibility: '10+2 with PCB (50% min)',
      exam: 'NEET / State Health CET',
    });
  }

  if (streams.includes('Management')) {
    courses.push({
      id: `${row.id}-mba`,
      name: 'Master of Business Administration (MBA)',
      degree: 'MBA',
      stream: 'Management',
      duration: '2 Years',
      annualFee: 240000,
      seats: 120,
      eligibility: 'Graduation in any discipline + Entrance Score',
      exam: 'CAT / MAT / CMAT / State CET',
    });
    courses.push({
      id: `${row.id}-bba`,
      name: 'Bachelor of Business Administration (BBA)',
      degree: 'BBA',
      stream: 'Management',
      duration: '3 Years',
      annualFee: 95000,
      seats: 90,
      eligibility: '10+2 in any stream',
      exam: 'Merit / Entrance',
    });
  }

  if (streams.includes('Commerce')) {
    courses.push({
      id: `${row.id}-bcom`,
      name: 'Bachelor of Commerce (B.Com Hons / General)',
      degree: 'B.Com',
      stream: 'Commerce',
      duration: '3 Years',
      annualFee: 35000,
      seats: 180,
      eligibility: '10+2 with Commerce / Math',
      exam: 'CUET / Merit Based',
    });
  }

  if (streams.includes('Law')) {
    courses.push({
      id: `${row.id}-law`,
      name: 'B.A. LL.B. / B.B.A. LL.B. (5-Year Integrated)',
      degree: 'Integrated Law',
      stream: 'Law',
      duration: '5 Years',
      annualFee: 150000,
      seats: 120,
      eligibility: '10+2 in any stream (45% min)',
      exam: 'CLAT / State Law CET',
    });
  }

  if (courses.length === 0) {
    courses.push({
      id: `${row.id}-gen`,
      name: `Bachelor of Arts / Science / Commerce Program`,
      degree: 'UG',
      stream: primaryStream,
      duration: '3 Years',
      annualFee: 25000,
      seats: 120,
      eligibility: '10+2 from recognized board',
      exam: 'Merit / State Entrance',
    });
  }

  return courses;
}

/**
 * Intelligently derives a clean, recognizable human-readable short name for an institution.
 * NEVER returns an AISHE code (e.g. C-12345, U-0456), numeric IDs, or placeholder strings.
 */
export function deriveCollegeShortName(name: string, rawShortName?: string, aisheCode?: string): string {
  // If rawShortName is already provided in DB, check that it's NOT an AISHE code or raw ID
  if (rawShortName && typeof rawShortName === 'string') {
    const trimmed = rawShortName.trim();
    const isAishe = /^([UC]|\bAISHE\b)[-_ ]?\d+/i.test(trimmed);
    const isCodeMatch = aisheCode && trimmed.toLowerCase() === aisheCode.trim().toLowerCase();
    const isNumeric = /^\d+$/.test(trimmed);
    if (trimmed.length > 0 && !isAishe && !isCodeMatch && !isNumeric) {
      return trimmed;
    }
  }

  if (!name || !name.trim()) return 'Higher Education Institution';

  let clean = name.trim();

  // Strip extraneous AISHE or ID markers e.g. "(Id: C-12345)", "[C-1234]", "(AISHE: U-0123)"
  clean = clean.replace(/\s*[\(\[]\s*(?:id|aishe|code)?\s*[:\-_]?\s*[a-z0-9\-]+\s*[\)\]]/gi, '');
  // Strip "(Autonomous)", "(Shift-1)", "(Night College)", etc.
  clean = clean.replace(/\s*[\(\[]\s*(?:autonomous|shift[-\s]?\d|evening|morning|night)\s*[\)\]]/gi, '');
  // Strip trailing "(India)"
  clean = clean.replace(/\s*[\(\[]\s*india\s*[\)\]]/gi, '');

  // High-profile institution acronym mapping for crisp, punchy pill labels
  clean = clean.replace(/^Indian Institute of Technology\b/i, 'IIT');
  clean = clean.replace(/^National Institute of Technology\b/i, 'NIT');
  clean = clean.replace(/^Indian Institute of Information Technology\b/i, 'IIIT');
  clean = clean.replace(/^Indian Institute of Management\b/i, 'IIM');
  clean = clean.replace(/^Indian Institute of Science\b/i, 'IISc');
  clean = clean.replace(/^All India Institute of Medical Sciences\b/i, 'AIIMS');
  clean = clean.replace(/^Birla Institute of Technology and Science\b/i, 'BITS');
  clean = clean.replace(/^Birla Institute of Technology\b/i, 'BIT');
  clean = clean.replace(/^Vellore Institute of Technology\b/i, 'VIT');
  clean = clean.replace(/^National Law School of India University\b/i, 'NLSIU');
  clean = clean.replace(/^National Law University\b/i, 'NLU');
  clean = clean.replace(/^Government College of Engineering\b/i, 'GCE');
  clean = clean.replace(/^Government Engineering College\b/i, 'GEC');
  clean = clean.replace(/^Government Medical College\b/i, 'GMC');
  clean = clean.replace(/^Government Degree College\b/i, 'GDC');
  clean = clean.replace(/^Government First Grade College\b/i, 'GFGC');
  clean = clean.replace(/^Government Arts College\b/i, 'GAC');
  clean = clean.replace(/^Government Polytechnic\b/i, 'Govt Polytechnic');
  clean = clean.replace(/^Government\b/i, 'Govt');

  // Common phrase shorteners
  clean = clean.replace(/Engineering and Technology\b/i, 'Engg & Tech');
  clean = clean.replace(/Institute of Technology\b/i, 'Institute of Tech');
  clean = clean.replace(/Institute of Management\b/i, 'Institute of Mgmt');

  // If already concise (<= 32 chars), return clean
  if (clean.length <= 32) {
    return clean;
  }

  // If there's a comma (e.g. "Thapar Institute of Engg & Tech, Patiala" or "Govt College, Karnal")
  const commaParts = clean.split(/[,;\-–]/).map((p) => p.trim()).filter(Boolean);
  if (commaParts.length > 0 && commaParts[0].length >= 4 && commaParts[0].length <= 32) {
    return commaParts[0];
  }

  // Word boundary truncation near 32 chars
  if (clean.length > 32) {
    const cut = clean.slice(0, 32);
    const lastSpace = cut.lastIndexOf(' ');
    if (lastSpace > 16) {
      return cut.slice(0, lastSpace);
    }
    return cut;
  }

  return clean;
}

export function mapDatabaseRowToCollege(row: Record<string, any>): College {
  const name = row.name || row.college_name || row.institution_name || 'Unnamed Institution';
  const shortName = deriveCollegeShortName(name, row.short_name, row.aishe_code);
  const slug = row.slug || `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${row.id || Math.random().toString(36).substring(7)}`;
  const city = row.city || row.district || row.location || 'India';
  const state = row.state || row.state_name || 'India';
  const universityType = row.type || row.institution_category || row.university_type || row.standalone_type || 'Affiliated College';
  const ownership = row.ownership || row.management_type || 'Private';
  const naacGrade = row.naac_grade || (row.naac_cgpa && row.naac_cgpa > 3.5 ? 'A++' : row.naac_cgpa && row.naac_cgpa > 3.2 ? 'A+' : 'A');
  const nirfRank = row.nirf_rank_overall || row.nirf_rank_university || row.nirf_rank_college || row.nirf_rank_engineering || row.nirf_rank_management || row.nirf_rank_medical || undefined;

  const streams = inferStreamsFromNameAndData(row);
  const facilities = buildFacilitiesFromRow(row);
  const courses = generateCoursesForInstitution(row, streams);

  const approvals: string[] = [];
  if (row.is_ugc_recognized) approvals.push('UGC');
  if (row.is_aicte_approved) approvals.push('AICTE');
  if (row.nba_accredited) approvals.push('NBA');
  if (approvals.length === 0) approvals.push('State Directorate of Higher Education');

  const medianPackage = Number(row.median_package_lpa || row.avg_package_lpa || (nirfRank && nirfRank < 100 ? 12.5 : 5.8));
  const highestPackage = Number(row.highest_package_lpa || (medianPackage * 2.5));

  const exams: string[] = [];
  if (row.entrance_exams_accepted) {
    if (Array.isArray(row.entrance_exams_accepted)) {
      exams.push(...row.entrance_exams_accepted);
    } else {
      exams.push(String(row.entrance_exams_accepted));
    }
  } else {
    if (streams.includes('Engineering')) exams.push('JEE Main', 'State CET');
    if (streams.includes('Medical')) exams.push('NEET-UG');
    if (streams.includes('Management')) exams.push('CAT', 'MAT', 'CMAT');
    if (streams.includes('Law')) exams.push('CLAT');
    if (exams.length === 0) exams.push('Merit / State Counseling');
  }

  const defaultDesc = `${name} is a higher education institution located in ${city}, ${state}. ${row.parent_university ? 'Affiliated with ' + row.parent_university + '. ' : ''}Offering programs across ${streams.join(', ')}.`;

  const rawLat = row.latitude ? Number(row.latitude) : null;
  const rawLng = row.longitude ? Number(row.longitude) : null;
  const hasValidRawCoords = rawLat !== null && rawLng !== null && !isNaN(rawLat) && !isNaN(rawLng) && rawLat !== 0;

  const [lat, lng] = hasValidRawCoords
    ? [rawLat, rawLng]
    : getCollegeCoordinates({ city, state, name, id: String(row.id || '') } as any);

  return {
    id: String(row.id || row.aishe_code || slug),
    slug: String(slug),
    name: String(name),
    shortName: String(shortName),
    code: row.aishe_code || undefined,
    aisheCode: row.aishe_code || undefined,
    universityType: String(universityType),
    ownership: String(ownership),
    establishedYear: Number(row.established_year || 1995),
    genderType: row.gender_type || (row.is_women_only ? 'Women Only' : 'Co-ed'),
    state: String(state),
    city: String(city),
    district: row.district || undefined,
    pincode: row.pincode || undefined,
    address: row.address || `${city}, ${state}`,
    campusAreaAcres: Number(row.campus_size_acres || 25),
    lat,
    lng,
    naacGrade: String(naacGrade),
    naacCgpa: row.naac_cgpa ? Number(row.naac_cgpa) : undefined,
    nirfOverallRank: nirfRank ? Number(nirfRank) : undefined,
    nirfStreamRank: row.nirf_rank_engineering ? { stream: 'Engineering', rank: row.nirf_rank_engineering } : undefined,
    approvals: approvals,
    affiliatingUniversity: row.parent_university || undefined,
    streams: streams,
    levels: ['UG', 'PG'],
    avgAnnualFeeMin: Number(row.avg_annual_fee_min || 0.75),
    avgAnnualFeeMax: Number(row.avg_annual_fee_max || 2.80),
    medianPackageLpa: medianPackage,
    highestPackageLpa: highestPackage,
    topRecruiters: row.top_recruiters && Array.isArray(row.top_recruiters) ? row.top_recruiters : ['National Recruiters', 'Corporate Partners'],
    examsAccepted: exams,
    description: row.description || defaultDesc,
    website: row.website || 'https://superadmission.com',
    phone: row.phone || '+91 1800 000 000',
    email: row.email || 'info@superadmission.com',
    facilities: facilities,
    courses: courses,
    isVerified: Boolean(row.is_verified ?? true),
    isFeatured: Boolean(row.is_top5000_launch ?? false),
  };
}

export interface FetchCollegesResult {
  colleges: College[];
  totalCount: number;
  isLiveDatabase: boolean;
  page: number;
  pageSize: number;
  totalPages: number;
  error?: string;
}

export async function queryCollegesFromDatabase(filters: FilterState): Promise<FetchCollegesResult> {
  const isLive = isSupabaseConfigured();
  const page = filters.page || 1;
  const pageSize = filters.pageSize || 24;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  if (isLive) {
    try {
      const targetTable = 'institutions';
      const hasSearch = Boolean(filters.searchQuery && filters.searchQuery.trim());
      // Skip expensive exact count during text search to prevent Postgres statement timeouts
      let query = supabase.from(targetTable).select('*', hasSearch ? undefined : { count: 'exact' });

      // Search strictly by institution name, short name, city, and state (NO AISHE codes)
      if (hasSearch) {
        const raw = filters.searchQuery.trim();
        const clean = raw.replace(/['"%,()]/g, '');

        if (clean.length > 0) {
          const expansions = expandSearchQuery(clean);

          if (expansions.length > 1) {
            // Known acronym or alias (e.g. "iitb", "bits", "coep", "vit", "thapar")
            // Search expansions across name and city without querying aishe_code
            const clauses: string[] = [];
            for (const exp of expansions) {
              const expClean = exp.replace(/['"%,()]/g, '').trim();
              if (expClean.length > 0) {
                clauses.push(`name.ilike.%${expClean}%`);
              }
            }
            clauses.push(`name.ilike.%${clean}%`);
            clauses.push(`city.ilike.%${clean}%`);
            query = query.or(clauses.slice(0, 8).join(','));
          } else {
            // Tokenize multi-word query
            const tokens = clean.split(/\s+/).filter((t) => t.length > 1);

            if (tokens.length >= 2) {
              const first = tokens[0];
              const rest = tokens.slice(1).join(' ');

              if (/^(iit|indian institute of technology)$/i.test(first)) {
                query = query.or('name.ilike.%Indian Institute of Technology%,name.ilike.%IIT%');
                query = query.or(`name.ilike.%${rest}%,city.ilike.%${rest}%`);
              } else if (/^(nit|national institute of technology)$/i.test(first)) {
                query = query.or('name.ilike.%National Institute of Technology%,name.ilike.%NIT%');
                query = query.or(`name.ilike.%${rest}%,city.ilike.%${rest}%`);
              } else if (/^(iim|indian institute of management)$/i.test(first)) {
                query = query.or('name.ilike.%Indian Institute of Management%,name.ilike.%IIM%');
                query = query.or(`name.ilike.%${rest}%,city.ilike.%${rest}%`);
              } else if (/^(iiit)$/i.test(first)) {
                query = query.or('name.ilike.%Indian Institute of Information Technology%,name.ilike.%International Institute of Information Technology%,name.ilike.%IIIT%');
                query = query.or(`name.ilike.%${rest}%,city.ilike.%${rest}%`);
              } else if (/^(aiims)$/i.test(first)) {
                query = query.or('name.ilike.%All India Institute of Medical Sciences%,name.ilike.%AIIMS%');
                query = query.or(`name.ilike.%${rest}%,city.ilike.%${rest}%`);
              } else {
                // Match full phrase or tokens across name, city, state
                query = query.or(`name.ilike.%${clean}%,name.ilike.%${first}%,city.ilike.%${rest}%,city.ilike.%${first}%`);
              }
            } else {
              // Single token: search name, city, state (never AISHE code)
              query = query.or(`name.ilike.%${clean}%,city.ilike.%${clean}%,state.ilike.%${clean}%`);
            }
          }
        }
      }


      // States Filter
      if (filters.selectedStates && filters.selectedStates.length > 0) {
        query = query.in('state', filters.selectedStates);
      }

      // Stream Filter
      if (filters.selectedStreams && filters.selectedStreams.length > 0) {
        const stream = filters.selectedStreams[0];
        if (stream && stream !== 'All') {
          query = query.or(`stream.ilike.%${stream}%,name.ilike.%${stream}%`);
        }
      }

      // Types / Categories Filter
      if (filters.selectedTypes && filters.selectedTypes.length > 0) {
        const t = filters.selectedTypes[0];
        if (t && t !== 'All') {
          if (t === 'Central / IIT / NIT') {
            query = query.or('university_type.ilike.%Central%,university_type.ilike.%National Importance%,name.ilike.%Indian Institute of Technology%,name.ilike.%National Institute of Technology%');
          } else if (t === 'State Public') {
            query = query.or('university_type.ilike.%State Public%,type.ilike.%State%');
          } else if (t === 'Private Deemed') {
            query = query.or('university_type.ilike.%Private%,university_type.ilike.%Deemed%');
          } else if (t === 'Affiliated College' || t === 'College') {
            query = query.ilike('type', '%College%');
          } else {
            query = query.or(`type.ilike.%${t}%,university_type.ilike.%${t}%`);
          }
        }
      }

      // NIRF Rank Filter
      if (filters.maxNirfRank) {
        query = query.not('nirf_rank_overall', 'is', null).lte('nirf_rank_overall', filters.maxNirfRank);
        if (filters.minNirfRank) {
          query = query.gte('nirf_rank_overall', filters.minNirfRank);
        }
      }

      // Ownership Filter
      if (filters.selectedOwnership && filters.selectedOwnership.length > 0) {
        query = query.in('ownership', filters.selectedOwnership);
      }

      // NAAC Filter
      if (filters.selectedNaac && filters.selectedNaac.length > 0) {
        const grades = filters.selectedNaac.filter((g) => g !== 'All');
        if (grades.length > 0) {
          query = query.in('naac_grade', grades);
        }
      }

      // CTC Filter
      if (filters.minPackageLpa) {
        query = query.gte('median_package_lpa', filters.minPackageLpa);
      }

      // Sorting
      if (filters.sortBy === 'nirf') {
        query = query.order('nirf_rank_overall', { ascending: true, nullsFirst: false });
      } else if (filters.sortBy === 'package_desc') {
        query = query.order('highest_package_lpa', { ascending: false, nullsFirst: false });
      } else if (filters.sortBy === 'established') {
        query = query.order('established_year', { ascending: true, nullsFirst: false });
      } else if (filters.sortBy === 'name') {
        query = query.order('name', { ascending: true });
      }

      // Paginated Range
      query = query.range(from, to);

      const { data, count, error } = await query;

      if (!error && data) {
        const mapped = data.map(mapDatabaseRowToCollege);
        const total = count ?? 70623;
        return {
          colleges: mapped,
          totalCount: total,
          isLiveDatabase: true,
          page,
          pageSize,
          totalPages: Math.max(1, Math.ceil(total / pageSize)),
        };
      }
    } catch (err: any) {
      console.warn('Supabase query error, using local fallback:', err?.message || err);
    }
  }

  // Local fallback
  let localList = [...COLLEGES_DATA];

  if (filters.searchQuery.trim()) {
    localList = localList.filter((col) => fuzzyMatchInstitution(col, filters.searchQuery));
  }

  if (filters.selectedStates.length > 0) {
    localList = localList.filter((col) => filters.selectedStates.includes(col.state));
  }

  const total = localList.length;
  const paginated = localList.slice(from, to + 1);

  return {
    colleges: paginated,
    totalCount: total,
    isLiveDatabase: false,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getCollegeById(idOrSlug: string): Promise<College | null> {
  const isLive = isSupabaseConfigured();

  if (isLive) {
    try {
      const clean = idOrSlug.trim();
      const isNum = /^\d+$/.test(clean);
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clean);

      // 1. If numeric or uuid, try id
      if (isNum || isUuid) {
        const { data } = await supabase
          .from('institutions')
          .select('*')
          .eq('id', clean)
          .maybeSingle();

        if (data) return mapDatabaseRowToCollege(data);
      }

      // 2. Try aishe_code
      const { data: aisheData } = await supabase
        .from('institutions')
        .select('*')
        .eq('aishe_code', clean)
        .maybeSingle();

      if (aisheData) return mapDatabaseRowToCollege(aisheData);

      // 3. Try slug
      const { data: slugData } = await supabase
        .from('institutions')
        .select('*')
        .eq('slug', clean)
        .maybeSingle();

      if (slugData) return mapDatabaseRowToCollege(slugData);

      // 4. Try name match
      const { data: nameData } = await supabase
        .from('institutions')
        .select('*')
        .ilike('name', `%${clean}%`)
        .limit(1)
        .maybeSingle();

      if (nameData) return mapDatabaseRowToCollege(nameData);
    } catch (err) {
      console.warn('Error fetching single college by id:', err);
    }
  }

  const local = COLLEGES_DATA.find((c) => c.id === idOrSlug || c.slug === idOrSlug || c.code === idOrSlug);
  return local || null;
}
