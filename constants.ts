
import { EducationLevel, Opportunity, OpportunityType } from './types';

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: '1',
    title: 'Google STEP Internship',
    organization: 'Google',
    description: 'A 12-week developmental program for first and second-year undergraduate students with a passion for computer science.',
    deadline: '2024-11-15',
    type: OpportunityType.INTERNSHIP,
    level: [EducationLevel.UNDERGRADUATE],
    location: 'Remote/Global',
    requirements: ['CS Major', '1st/2nd Year', 'Passion for tech'],
    eligibility: 'Must be a current first or second-year undergraduate student enrolled in a Computer Science or related degree program.'
  },
  {
    id: '2',
    title: "NASA L'SPACE Academy",
    organization: 'NASA',
    description: 'A free, online interactive program open to undergraduate STEM students to learn the rigors of space mission design.',
    deadline: '2025-01-10',
    type: OpportunityType.RESEARCH,
    level: [EducationLevel.UNDERGRADUATE, EducationLevel.GRADUATE],
    location: 'Online',
    requirements: ['STEM Major', 'US Citizen/Permanent Resident', 'Interest in space exploration'],
    eligibility: 'Current community college or university students pursuing a degree in a STEM-related field.'
  },
  {
    id: '3',
    title: 'Major League Hacking (MLH) Hackathon',
    organization: 'MLH',
    description: 'Join thousands of students globally for a weekend of building, learning, and sharing cool projects.',
    deadline: '2024-12-05',
    type: OpportunityType.HACKATHON,
    level: [EducationLevel.HIGH_SCHOOL, EducationLevel.UNDERGRADUATE],
    location: 'Multiple Locations / Online',
    requirements: ['Any major', 'Interest in coding', 'Laptop'],
    eligibility: 'All students (High School, Undergraduate, Graduate) and recent graduates are welcome to participate.'
  },
  {
    id: '4',
    title: 'Fulbright Foreign Student Program',
    organization: 'Fulbright',
    description: 'Enables graduate students, young professionals, and artists from abroad to study and conduct research in the US.',
    deadline: '2025-05-30',
    type: OpportunityType.FELLOWSHIP,
    level: [EducationLevel.GRADUATE, EducationLevel.PROFESSIONAL],
    location: 'United States',
    requirements: ['Bachelors degree', 'Language proficiency', 'Research proposal'],
    eligibility: 'Qualified candidates with a strong academic background and leadership potential.'
  },
  {
    id: '5',
    title: 'NMSC National Merit Scholarship',
    organization: 'National Merit Scholarship Corp',
    description: 'Premier scholarship program for high school students based on PSAT/NMSQT scores.',
    deadline: '2025-01-31',
    type: OpportunityType.SCHOLARSHIP,
    level: [EducationLevel.HIGH_SCHOOL],
    amount: '$2,500',
    location: 'United States',
    requirements: ['High School Junior/Senior', 'PSAT scores'],
    eligibility: 'U.S. high school students who take the PSAT/NMSQT in their junior year.'
  }
];

export const EDUCATION_LEVEL_LABELS = {
  [EducationLevel.HIGH_SCHOOL]: 'High School',
  [EducationLevel.UNDERGRADUATE]: 'Undergraduate',
  [EducationLevel.GRADUATE]: 'Graduate / PhD',
  [EducationLevel.PROFESSIONAL]: 'Professional'
};
