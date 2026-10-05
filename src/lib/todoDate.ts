export function isOverdue(date?: string): boolean {
  if (!date) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(date);
  dueDate.setHours(0, 0, 0, 0);

  return today > dueDate;
}
