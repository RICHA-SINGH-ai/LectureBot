// This file contains the hardcoded schedule data based on the provided image.

type Professor = {
  initials: string;
  name: string;
};

type Course = {
  code: string;
  name: string;
  type: 'Lecture' | 'Lab' | 'Project' | 'Library' | 'Lunch';
};

type Lecture = {
  day: string;
  section: 'A' | 'B';
  room: string;
  time: string;
  courseCode: string;
  professorInitials: string[];
};

export const professors: Professor[] = [
  { initials: 'MMP', name: 'Mrs. Mamata M. Panda' },
  { initials: 'PS', name: 'Mr. Prashant Srivastava' },
  { initials: 'AS', name: 'Mr. Akhilesh Singh' },
  { initials: 'RP', name: 'Prof. Rabins Porwal' },
  { initials: 'MT', name: 'Dr. Mamta Tiwari' },
  { initials: 'MR', name: 'Dr. Mayur Rahul' },
  { initials: 'ArS', name: 'Dr. Arpita Singh' },
];

export const courses: Course[] = [
  { code: 'MCA-3001', name: 'Computer Networks', type: 'Lecture' },
  { code: 'MCA-3002', name: 'Artificial Intelligence', type: 'Lecture' },
  { code: 'MCA-3003', name: 'Software Engineering', type: 'Lecture' },
  { code: 'MCA-3005', name: 'Elective-I (Data Warehousing & Data Mining)', type: 'Lecture' },
  { code: 'MCA-3011', name: 'Elective-II (Digital Image Processing)', type: 'Lecture' },
  { code: 'MCA-3051', name: 'Software Engineering Lab', type: 'Lab' },
  { code: 'MCA-3052', name: 'Mini Project (AI / ISCL)', type: 'Project' },
  { code: 'Lib', name: 'Library', type: 'Library' },
  { code: 'Lunch', name: 'Lunch Break', type: 'Lunch' },
];

const scheduleGrid: Omit<Lecture, 'day' | 'section' | 'room'>[] = [
  // Section A: Monday, Wednesday, Friday in CA-213
  { time: '10:00 - 11:00', courseCode: 'MCA-3003', professorInitials: ['AS'] },
  { time: '11:00 - 12:00', courseCode: 'MCA-3011', professorInitials: ['MR'] },
  { time: '12:00 - 01:00', courseCode: 'Lib', professorInitials: [] },
  { time: '01:00 - 02:00', courseCode: 'Lunch', professorInitials: [] },
  { time: '02:00 - 03:00', courseCode: 'MCA-3002', professorInitials: ['PS'] },
  { time: '03:00 - 05:00', courseCode: 'MCA-3051', professorInitials: ['PS', 'AS', 'RP'] }, // SE Lab, Tue & Sat

  // Section B: Monday, Wednesday, Friday in CA-303
  { time: '10:00 - 11:00', courseCode: 'MCA-3003', professorInitials: ['RP'] },
  { time: '11:00 - 12:00', courseCode: 'MCA-3001', professorInitials: ['MMP'] },
  { time: '12:00 - 01:00', courseCode: 'MCA-3002', professorInitials: ['PS'] },
  { time: '01:00 - 02:00', courseCode: 'Lunch', professorInitials: [] },
  { time: '02:00 - 04:00', courseCode: 'MCA-3052', professorInitials: ['PS', 'AS', 'RP'] }, // Mini Project, On Thu

  // Section A: Tuesday, Thursday, Saturday in CA-213
  { time: '10:00 - 11:00', courseCode: 'MCA-3001', professorInitials: ['MMP'] },
  { time: '11:00 - 12:00', courseCode: 'MCA-3005', professorInitials: ['MT'] },
  // { time: '12:00 - 01:00', courseCode: 'Lib', professorInitials: [] }, // Already covered above
  // { time: '01:00 - 02:00', courseCode: 'Lunch', professorInitials: [] }, // Already covered above

  // Section B: Tuesday, Thursday, Saturday in CA-303
  { time: '10:00 - 11:00', courseCode: 'MCA-3011', professorInitials: ['MR'] },
  { time: '11:00 - 12:00', courseCode: 'Lib', professorInitials: [] },
  { time: '12:00 - 01:00', courseCode: 'Lunch', professorInitials: [] },
  { time: '01:00 - 02:00', courseCode: 'MCA-3005', professorInitials: ['MT'] },
];

// Helper function to get full professor names from initials
const getProfessorNames = (initials: string[]) => {
  return initials.map(init => professors.find(p => p.initials === init)?.name || init).join(', ');
};

const getCourseName = (code: string) => {
    return courses.find(c => c.code === code)?.name || code;
}

// Full schedule generation
const generateFullSchedule = () => {
  const fullSchedule: any[] = [];

  const daysA_MWF = ['Monday', 'Wednesday', 'Friday'];
  const daysB_MWF = ['Monday', 'Wednesday', 'Friday'];
  const daysA_TTS = ['Tuesday', 'Thursday', 'Saturday'];
  const daysB_TTS = ['Tuesday', 'Thursday', 'Saturday'];
  
  // MWF - Section A
  daysA_MWF.forEach(day => {
    fullSchedule.push(
      { day, section: 'A', room: 'CA-213', time: '10:00 - 11:00', course: 'MCA-3003', professor: ['AS'] },
      { day, section: 'A', room: 'CA-213', time: '11:00 - 12:00', course: 'MCA-3011', professor: ['MR'] },
      { day, section: 'A', room: 'CA-213', time: '12:00 - 01:00', course: 'Lib', professor: [] },
      { day, section: 'A', room: 'CA-213', time: '01:00 - 02:00', course: 'Lunch', professor: [] },
      { day, section: 'A', room: 'CA-213', time: '02:00 - 03:00', course: 'MCA-3002', professor: ['PS'] }
    );
  });

  // MWF - Section B
  daysB_MWF.forEach(day => {
     fullSchedule.push(
      { day, section: 'B', room: 'CA-303', time: '10:00 - 11:00', course: 'MCA-3003', professor: ['RP'] },
      { day, section: 'B', room: 'CA-303', time: '11:00 - 12:00', course: 'MCA-3001', professor: ['MMP'] },
      { day, section: 'B', room: 'CA-102', time: '12:00 - 01:00', course: 'MCA-3002', professor: ['PS'] },
      { day, section: 'B', room: 'CA-303', time: '01:00 - 02:00', course: 'Lunch', professor: [] },
     )
  });

  // TTS - Section A
  daysA_TTS.forEach(day => {
    fullSchedule.push(
      { day, section: 'A', room: 'CA-213', time: '10:00 - 11:00', course: 'MCA-3001', professor: ['MMP'] },
      { day, section: 'A', room: 'CA-213', time: '11:00 - 12:00', course: 'MCA-3005', professor: ['MT'] },
      { day, section: 'A', room: 'CA-213', time: '12:00 - 01:00', course: 'Lib', professor: [] },
      { day, section: 'A', room: 'CA-213', time: '01:00 - 02:00', course: 'Lunch', professor: [] }
    );
  });

  // TTS - Section B
  daysB_TTS.forEach(day => {
      fullSchedule.push(
      { day, section: 'B', room: 'CA-303', time: '10:00 - 11:00', course: 'MCA-3011', professor: ['MR'] },
      { day, section: 'B', room: 'CA-303', time: '11:00 - 12:00', course: 'Lib', professor: [] },
      { day, section: 'B', room: 'CA-303', time: '12:00 - 01:00', course: 'Lunch', professor: [] },
      { day, section: 'B', room: 'CA-303', time: '01:00 - 02:00', course: 'MCA-3005', professor: ['MT'] }
    );
  });
  
  // Special Labs/Projects
  ['Tuesday', 'Saturday'].forEach(day => {
      fullSchedule.push({ day, section: 'A', room: 'CA-303', time: '03:00 - 05:00', course: 'MCA-3051', professor: ['PS', 'AS', 'RP'] });
  });
   ['Thursday'].forEach(day => {
      fullSchedule.push({ day, section: 'A', room: 'CA-303', time: '03:00 - 05:00', course: 'MCA-3052', professor: ['PS', 'AS', 'RP'] });
  });

  return fullSchedule.map(item => ({
    ...item,
    title: getCourseName(item.course),
    professor: getProfessorNames(item.professor)
  }));
};


export const scheduleData = {
  professors,
  courses,
  schedule: generateFullSchedule(),
};
