export const MAX_LEVEL = 55;
export const BASE_XP_PER_LEVEL = 3;
export const EXPONENT = 1.2;
export const BASE_TASK_XP = 20;
export const MIN_XP_DURATION = 30; // Minimum duration in seconds to earn XP
export const XP_CURVE_EXPONENT = 0.5; // Lower means faster early XP, slower later

// Generate a table of XP thresholds for each level
export function generateXPTable() {
  const thresholds = [0]; // XP to reach each level
  for (let level = 1; level <= MAX_LEVEL; level++) {
    const xp = Math.floor(BASE_XP_PER_LEVEL * Math.pow(level, EXPONENT));
    thresholds.push(thresholds[level - 1] + xp);
  }
  return thresholds;
}

const xpTable = generateXPTable();

// Return the user's level based on total XP
export function getLevelFromXP(totalXP: number): number {
  for (let level = 1; level <= MAX_LEVEL; level++) {
    if (totalXP < xpTable[level]) {
      return level;
    }
  }
  return MAX_LEVEL;
}
