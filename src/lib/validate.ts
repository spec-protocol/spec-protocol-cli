import { TASK_ID_PATTERN } from "../constants.js";

export function validateTaskId(taskId: string): string | null {
  if (!taskId || taskId.trim() === "") {
    return "ID da tarefa é obrigatório.";
  }
  if (taskId.includes("..") || taskId.includes("/") || taskId.includes("\\")) {
    return "ID da tarefa inválido (não use paths).";
  }
  if (!TASK_ID_PATTERN.test(taskId)) {
    return "ID deve conter apenas letras, números, hífen e underscore, começando com alfanumérico.";
  }
  return null;
}
