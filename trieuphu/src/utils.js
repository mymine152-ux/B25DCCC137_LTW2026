import { PRIZES, MILESTONES } from './data';

export const calcPrize = (correctCount, reason) => {
  if (reason === 'stop') {
    if (correctCount === 0) return 0;
    return PRIZES[correctCount - 1];
  }
  if (correctCount === 15) {
    return PRIZES[14];
  }
  const passedMilestones = MILESTONES.filter((m) => m <= correctCount);
  if (passedMilestones.length === 0) {
    return 0;
  }
  const safeMilestone = passedMilestones[passedMilestones.length - 1];
  return PRIZES[safeMilestone - 1];
};

export const calcAudienceVotes = (correctIndex, hiddenIndices = []) => {
  const votes = [0, 0, 0, 0];
  const correctPercent = Math.floor(Math.random() * 31) + 40;
  votes[correctIndex] = correctPercent;

  let remaining = 100 - correctPercent;
  const activeWrongIndices = [0, 1, 2, 3].filter(
    (idx) => idx !== correctIndex && !hiddenIndices.includes(idx)
  );

  if (activeWrongIndices.length === 1) {
    votes[activeWrongIndices[0]] = remaining;
  } else if (activeWrongIndices.length === 2) {
    const part = Math.floor(Math.random() * (remaining + 1));
    votes[activeWrongIndices[0]] = part;
    votes[activeWrongIndices[1]] = remaining - part;
  } else if (activeWrongIndices.length === 3) {
    const cut1 = Math.floor(Math.random() * (remaining + 1));
    const cut2 = Math.floor(Math.random() * (remaining + 1));
    const minCut = Math.min(cut1, cut2);
    const maxCut = Math.max(cut1, cut2);
    votes[activeWrongIndices[0]] = minCut;
    votes[activeWrongIndices[1]] = maxCut - minCut;
    votes[activeWrongIndices[2]] = remaining - maxCut;
  }

  return votes;
};
