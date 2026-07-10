export function roundName(round: number, maxRound: number): string {
  const distanceToFinal = maxRound - round;
  switch (distanceToFinal) {
    case 0:
      return "Final";
    case 1:
      return "Semifinals";
    case 2:
      return "Quarterfinals";
    case 3:
      return "Round of 16";
    case 4:
      return "Round of 32";
    default:
      return `Round ${round}`;
  }
}

export function roundTag(round: number, maxRound: number, slot: number): string {
  const distanceToFinal = maxRound - round;
  const prefix =
    distanceToFinal === 0
      ? "F"
      : distanceToFinal === 1
        ? "SF"
        : distanceToFinal === 2
          ? "QF"
          : `R${round}·`;
  return distanceToFinal === 0 ? prefix : `${prefix}${slot}`;
}

export function formatGoalDifference(diff: number): string {
  if (diff > 0) return `+${diff}`;
  if (diff < 0) return `−${Math.abs(diff)}`;
  return "0";
}

export function ordinal(position: number): string {
  const mod100 = position % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${position}th`;
  switch (position % 10) {
    case 1:
      return `${position}st`;
    case 2:
      return `${position}nd`;
    case 3:
      return `${position}rd`;
    default:
      return `${position}th`;
  }
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}
