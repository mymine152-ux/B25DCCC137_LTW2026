import { GRADES, RANKS } from './data';

export const getGrade = (score) => {
  return GRADES.find((g) => score >= g.min) || GRADES[GRADES.length - 1];
};

export const getRank = (gpa) => {
  const roundedGpa = Math.round(gpa * 100) / 100;
  const rank = RANKS.find((r) => roundedGpa >= r.min);
  return rank ? rank.title : 'Chưa xếp loại';
};

export const calcStats = (courses) => {
  if (!courses || courses.length === 0) {
    return {
      count: 0,
      credits: 0,
      points: 0,
      gpa: 0,
      rank: 'Chưa xếp loại',
    };
  }

  const count = courses.length;
  const credits = courses.reduce((sum, c) => sum + (Number(c.credits) || 0), 0);
  const points = courses.reduce((sum, c) => {
    const gradeObj = getGrade(c.score);
    return sum + (Number(c.credits) || 0) * gradeObj.point;
  }, 0);

  const rawGpa = credits > 0 ? points / credits : 0;
  const gpa = Math.round(rawGpa * 100) / 100;
  const rank = credits > 0 ? getRank(gpa) : 'Chưa xếp loại';

  return { count, credits, points, gpa, rank };
};

export const calcRequired = (courses, target, remaining) => {
  const targetNum = Number(target);
  const remNum = Number(remaining);

  if (
    isNaN(targetNum) ||
    isNaN(remNum) ||
    targetNum < 0 ||
    targetNum > 4 ||
    !Number.isInteger(remNum) ||
    remNum < 1
  ) {
    return 'Hãy nhập GPA mục tiêu (0–4) và số tín chỉ còn lại (từ 1)';
  }

  const { credits: earnedCredits, points: earnedPoints } = calcStats(courses);
  const need = (targetNum * (earnedCredits + remNum) - earnedPoints) / remNum;

  if (need > 4) {
    return 'Không thể đạt mục tiêu này';
  }
  if (need <= 0) {
    return 'Bạn đã đạt mục tiêu';
  }

  return `Cần đạt trung bình ${need.toFixed(2)} điểm (hệ 4) ở ${remNum} tín chỉ còn lại`;
};

