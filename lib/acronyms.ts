// Common Indian higher education acronyms and short forms mapping
export const COLLEGE_ACRONYMS: Record<string, string[]> = {
  iitb: ['IIT Bombay', 'Indian Institute of Technology Bombay', 'Powai'],
  iitd: ['IIT Delhi', 'Indian Institute of Technology Delhi', 'Hauz Khas'],
  iitm: ['IIT Madras', 'Indian Institute of Technology Madras', 'Chennai'],
  iitk: ['IIT Kanpur', 'Indian Institute of Technology Kanpur'],
  iitkgp: ['IIT Kharagpur', 'Indian Institute of Technology Kharagpur'],
  iitr: ['IIT Roorkee', 'Indian Institute of Technology Roorkee'],
  iitg: ['IIT Guwahati', 'Indian Institute of Technology Guwahati'],
  iith: ['IIT Hyderabad', 'Indian Institute of Technology Hyderabad'],
  iisc: ['IISc Bangalore', 'Indian Institute of Science', 'Bangalore'],
  iima: ['IIM Ahmedabad', 'Indian Institute of Management Ahmedabad'],
  iimb: ['IIM Bangalore', 'Indian Institute of Management Bangalore'],
  iimc: ['IIM Calcutta', 'Indian Institute of Management Calcutta'],
  iiml: ['IIM Lucknow', 'Indian Institute of Management Lucknow'],
  iimi: ['IIM Indore', 'Indian Institute of Management Indore'],
  iimk: ['IIM Kozhikode', 'Indian Institute of Management Kozhikode'],
  bits: ['BITS Pilani', 'Birla Institute of Technology and Science'],
  coep: ['COEP', 'College of Engineering Pune', 'Shivajinagar'],
  vit: ['VIT Vellore', 'Vellore Institute of Technology'],
  srcc: ['SRCC', 'Shri Ram College of Commerce', 'Delhi University'],
  aiims: ['AIIMS', 'All India Institute of Medical Sciences'],
  nlsiu: ['NLSIU', 'National Law School of India University', 'Bangalore'],
  dtu: ['DTU', 'Delhi Technological University', 'Delhi College of Engineering'],
  nsut: ['NSUT', 'Netaji Subhas University of Technology', 'Dwarka'],
  nitk: ['NIT Surathkal', 'National Institute of Technology Karnataka'],
  nitt: ['NIT Trichy', 'National Institute of Technology Tiruchirappalli'],
  iiith: ['IIIT Hyderabad', 'International Institute of Information Technology'],
  iiitb: ['IIIT Bangalore', 'International Institute of Information Technology'],
  iiitd: ['IIIT Delhi', 'Indraprastha Institute of Information Technology'],
  mahe: ['MAHE', 'Manipal Academy of Higher Education', 'Kasturba'],
  du: ['University of Delhi', 'Delhi University'],
  jnu: ['Jawaharlal Nehru University', 'New Delhi'],
  bhu: ['Banaras Hindu University', 'Varanasi'],
  amu: ['Aligarh Muslim University'],
  ju: ['Jadavpur University', 'Kolkata'],
  vjti: ['VJTI', 'Veermata Jijabai Technological Institute', 'Mumbai'],
  spce: ['Sardar Patel College of Engineering', 'Mumbai'],
  pict: ['Pune Institute of Computer Technology'],
  mit: ['Maharashtra Institute of Technology', 'Manipal Institute of Technology'],
  srm: ['SRM Institute of Science and Technology', 'Chennai'],
  manipal: ['Manipal Academy of Higher Education', 'MAHE'],
  ashoka: ['Ashoka University', 'Sonipat'],
  opjindal: ['O.P. Jindal Global University', 'Sonipat'],
  nmims: ['NMIMS', 'Narsee Monjee Institute of Management Studies'],
  symbiosis: ['Symbiosis International', 'SIBM Pune', 'SLS Pune'],
  christ: ['Christ University', 'Bangalore'],
  cu: ['Chandigarh University', 'University of Calcutta'],
  thapar: ['Thapar Institute of Engineering and Technology', 'Patiala'],
  nid: ['National Institute of Design', 'Ahmedabad'],
  nift: ['National Institute of Fashion Technology'],
};

export function expandSearchQuery(query: string): string[] {
  const clean = query.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!clean) return [];

  const expansions = [query.trim()];
  if (COLLEGE_ACRONYMS[clean]) {
    expansions.push(...COLLEGE_ACRONYMS[clean]);
  }
  return expansions;
}

