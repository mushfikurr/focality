import { Doc } from "../_generated/dataModel";

export const MAX_LEVEL = 55;
export const BASE_XP_PER_LEVEL = 3;
export const EXPONENT = 1.2;

export const BASE_TASK_XP = 10;
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

// Return how much XP is needed to reach the next level
export function getXPToNextLevel(totalXP: number): number {
  const level = getLevelFromXP(totalXP);
  if (level >= MAX_LEVEL) return 0;
  return xpTable[level] - totalXP;
}

// Calculate XP gained from task duration
export function getXPGainFromDuration(actualMilliseconds: number): number {
  const actualSeconds = Math.floor(actualMilliseconds / 1000);

  // If the task duration is shorter than the minimum threshold, no XP
  if (actualSeconds < MIN_XP_DURATION) return 0;

  // Calculate the scaling factor based on the nonlinear curve
  const ratio = actualSeconds / 300;  // Using 5 minutes as a reference point (adjust as needed)

  // Apply the nonlinear reward curve (the lower the value, the more XP for early tasks)
  const scaled = Math.pow(ratio, XP_CURVE_EXPONENT);

  // Calculate the XP based on the scaling
  const xp = BASE_TASK_XP * scaled;

  // Return the floor of the XP value to ensure it's an integer
  return Math.floor(xp);
}

