import { TASK_ID_PATTERN } from "../constants.js";

export function validateTaskId(taskId: string): string | null {
  if (!taskId || taskId.trim() === "") {
    return "Task ID is required.";
  }
  if (taskId.includes("..") || taskId.includes("/") || taskId.includes("\\")) {
    return "Invalid task ID (do not use paths).";
  }
  if (!TASK_ID_PATTERN.test(taskId)) {
    return "ID must contain only letters, numbers, hyphen and underscore, starting with alphanumeric.";
  }
  return null;
}
