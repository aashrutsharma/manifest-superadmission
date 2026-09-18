-- ==============================================================================
-- MANIFEST: Data Repository of Superadmission
-- Supabase PostgreSQL Schema for 70,000+ Indian Higher Education Institutions
-- Project Ref: rzaczgzbkqepdsvwuter (praveshdb)
-- ==============================================================================

-- Enable UUID extension & pg_trgm for ultra-fast full-text & fuzzy search
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. COLLEGES / UNIVERSITIES MASTER TABLE
CREATE TABLE IF NOT EXISTS public.colleges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(500) NOT NULL,
    short_name VARCHAR(100),
    code VARCHAR(50),
    university_type VARCHAR(100) NOT NULL, -- 'IIT', 'NIT', 'IIIT', 'IIM', 'AIIMS', 'Central University', 'State Govt', 'Private Deemed', 'Private University', 'Autonomous'
    ownership VARCHAR(50) NOT NULL DEFAULT 'Public', -- 'Public', 'Private', 'Public-Private'
    established_year INT,
    gender_type VARCHAR(30) DEFAULT 'Co-ed', -- 'Co-ed', 'Women Only'
    
    -- Location
    state VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    pincode VARCHAR(20),
    address TEXT,
    campus_area_acres NUMERIC(8,2),
    
    -- Accreditations & Recognitions
    naac_grade VARCHAR(10), -- 'A++', 'A+', 'A', 'B++', 'B+', 'B', 'C', 'NA'
    naac_cgpa NUMERIC(4,2),
    nirf_overall_rank INT,
    nirf_engineering_rank INT,
    nirf_management_rank INT,
    nirf_medical_rank INT,
    nirf_law_rank INT,
    approvals TEXT[], -- ARRAY['UGC', 'AICTE', 'MCI/NMC', 'BCI', 'PCI', 'COA']
    affiliating_university VARCHAR(300),
    
    -- Academic Streams & Offerings
    streams TEXT[] NOT NULL DEFAULT '{}', -- ARRAY['Engineering', 'Medical', 'Management', 'Law', 'Arts & Science', 'Design', 'Pharmacy', 'Commerce', 'Architecture']
    levels TEXT[] NOT NULL DEFAULT '{}', -- ARRAY['UG', 'PG', 'Diploma', 'Ph.D']
    
    -- Financials & Placements (INR in Lakhs)
    avg_annual_fee_min NUMERIC(10,2), -- in Lakhs (e.g. 1.5 = 1.5 Lakhs/yr)
    avg_annual_fee_max NUMERIC(10,2),
    median_package_lpa NUMERIC(6,2),  -- in LPA (e.g. 18.5)
    highest_package_lpa NUMERIC(6,2), -- in LPA (e.g. 64.0)
    top_recruiters TEXT[],
    
    -- Exams Accepted
    exams_accepted TEXT[], -- ARRAY['JEE Main', 'JEE Advanced', 'NEET', 'CAT', 'GATE', 'CUET', 'CLAT', 'KCET', 'MHT-CET', 'WBJEE', 'BITSAT']
    
    -- Contact & Web
    website_url VARCHAR(500),
    email VARCHAR(200),
    phone VARCHAR(100),
    logo_url TEXT,
    banner_url TEXT,
    description TEXT,
    
    -- Metadata
    is_verified BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. COURSES / PROGRAMS OFFERED
CREATE TABLE IF NOT EXISTS public.college_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    course_name VARCHAR(255) NOT NULL,
    degree_level VARCHAR(50) NOT NULL, -- 'B.Tech', 'MBBS', 'MBA', 'BBA', 'LLB', 'B.Sc', 'M.Tech', 'B.Des', 'B.Pharm'
    stream VARCHAR(100) NOT NULL,
    specialization VARCHAR(255),
    duration_years INT NOT NULL DEFAULT 4,
    total_seats INT,
    total_fee_inr NUMERIC(12,2),
    eligibility_criteria TEXT,
    exam_required VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CUTOFFS / ADMISSION BENCHMARKS
CREATE TABLE IF NOT EXISTS public.admission_cutoffs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.college_courses(id) ON DELETE CASCADE,
    exam_name VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    round_number INT DEFAULT 1,
    category VARCHAR(50) DEFAULT 'General', -- 'General', 'OBC', 'SC', 'ST', 'EWS'
    closing_rank INT,
    percentile NUMERIC(6,3),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CAMPUS FACILITIES
CREATE TABLE IF NOT EXISTS public.college_facilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    facility_name VARCHAR(100) NOT NULL, -- 'Hostel (Boys)', 'Hostel (Girls)', 'Sports Complex', 'Library', 'Wi-Fi Campus', 'Laboratories', 'Hospital/Medical', 'Auditorium'
    description TEXT,
    is_available BOOLEAN DEFAULT TRUE
);

-- 5. INDEXES FOR LIGHTNING FAST REPOSITORY SEARCH ACROSS 70K+ COLLEGES
CREATE INDEX IF NOT EXISTS idx_colleges_state ON public.colleges(state);
CREATE INDEX IF NOT EXISTS idx_colleges_city ON public.colleges(city);
CREATE INDEX IF NOT EXISTS idx_colleges_univ_type ON public.colleges(university_type);
CREATE INDEX IF NOT EXISTS idx_colleges_ownership ON public.colleges(ownership);
CREATE INDEX IF NOT EXISTS idx_colleges_naac ON public.colleges(naac_grade);
CREATE INDEX IF NOT EXISTS idx_colleges_nirf_overall ON public.colleges(nirf_overall_rank);
CREATE INDEX IF NOT EXISTS idx_colleges_streams ON public.colleges USING GIN (streams);
CREATE INDEX IF NOT EXISTS idx_colleges_exams ON public.colleges USING GIN (exams_accepted);

-- Trigram index on College Name and City for fuzzy/typeahead search
CREATE INDEX IF NOT EXISTS idx_colleges_name_trgm ON public.colleges USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_colleges_city_trgm ON public.colleges USING GIN (city gin_trgm_ops);

-- Enable Row Level Security (RLS)
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.college_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admission_cutoffs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.college_facilities ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public Read Access for Colleges" ON public.colleges FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Courses" ON public.college_courses FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Cutoffs" ON public.admission_cutoffs FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Facilities" ON public.college_facilities FOR SELECT USING (true);

