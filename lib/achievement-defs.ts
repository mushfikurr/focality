import { WithoutSystemFields } from "convex/server";
import { Doc } from "../convex/_generated/dataModel"
export const achievementDefinitions: WithoutSystemFields<Doc<"achievementDefinitions">>[] = [
  {
    title: "Getting Started",
    description: "Reached Level 2",
    type: "level",
    condition: "gte",
    conditionValue: "2",
  },
  {
    title: "On The Rise",
    description: "Reached Level 5",
    type: "level",
    condition: "gte",
    conditionValue: "5",
  },
  {
    title: "Double Digits",
    description: "Reached Level 10",
    type: "level",
    condition: "gte",
    conditionValue: "10",
  },
  {
    title: "Dedicated Climber",
    description: "Reached Level 15",
    type: "level",
    condition: "gte",
    conditionValue: "15",
  },
  {
    title: "Seasoned",
    description: "Reached Level 20",
    type: "level",
    condition: "gte",
    conditionValue: "20",
  },
  {
    title: "Veteran",
    description: "Reached Level 30",
    type: "level",
    condition: "gte",
    conditionValue: "30",
  },
  {
    title: "Master of the Craft",
    description: "Reached Level 50",
    type: "level",
    condition: "gte",
    conditionValue: "50",
  }
];
