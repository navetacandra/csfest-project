// backend/utils/date.utils.ts

export function getScheduleDatesArray(
  activatedAt: string,
  classScheduleDay: number,
): string[] {
  const scheduleDates: string[] = [];
  let currentSearchDate = new Date(activatedAt);
  currentSearchDate.setHours(0, 0, 0, 0); // Normalize to start of day

  // Find the first occurrence of classScheduleDay on or after activatedAt
  while (currentSearchDate.getDay() !== classScheduleDay) {
    currentSearchDate.setDate(currentSearchDate.getDate() + 1);
  }

  for (let i = 0; i < 18; i++) {
    scheduleDates.push(formatDateToISO(currentSearchDate));
    currentSearchDate.setDate(currentSearchDate.getDate() + 7); // Move to the next week
  }

  return scheduleDates;
}

export function formatDateToISO(date: Date): string {
  return date.toISOString().split('T')[0];
}
