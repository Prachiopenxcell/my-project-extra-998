import { VotingPhase, VotingStatus } from "../types/voting";

// Map internal/legacy status values to standardized public-facing phases
export function statusToPhase(status: VotingStatus): VotingPhase {
  switch (status) {
    case "draft":
    case "scheduled":
      return "upcoming";
    case "in_progress":
      return "ongoing";
    case "completed":
      return "concluded";
    case "cancelled":
      return "cancelled";
    case "review":
      // Post-close administrative state; treat as concluded for public UI
      return "concluded";
    default:
      return "upcoming";
  }
}

// Accepts common legacy labels and maps them to phases
export function labelToPhase(label: string): VotingPhase | undefined {
  const v = label.toLowerCase().trim();
  if (["active", "in progress", "in_progress", "open", "ongoing"].includes(v)) return "ongoing";
  if (["closed", "completed", "concluded", "ended", "finished"].includes(v)) return "concluded";
  if (["scheduled", "upcoming", "not started", "draft"].includes(v)) return "upcoming";
  if (["cancelled", "canceled"].includes(v)) return "cancelled";
  return undefined;
}

// Infer phase from dates (ISO strings). Now defaults to current time if not provided.
export function datesToPhase(startISO: string, endISO: string, now: Date = new Date()): VotingPhase {
  const start = new Date(startISO);
  const end = new Date(endISO);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return "upcoming";
  if (now < start) return "upcoming";
  if (now > end) return "concluded";
  return "ongoing";
}

// Phase to human-friendly display label
export function phaseDisplay(phase: VotingPhase): string {
  switch (phase) {
    case "upcoming":
      return "Upcoming";
    case "ongoing":
      return "Ongoing"; // preferred over Active/In Progress
    case "concluded":
      return "Concluded";
    case "cancelled":
      return "Cancelled";
  }
}

// Status to display label via phase
export function statusDisplay(status: VotingStatus): string {
  return phaseDisplay(statusToPhase(status));
}

// Simple badge class helper (tailwind-style) for consistent UI coloring
export function phaseBadgeClass(phase: VotingPhase): string {
  switch (phase) {
    case "upcoming":
      return "bg-blue-50 text-blue-700 ring-1 ring-blue-200";
    case "ongoing":
      return "bg-green-50 text-green-700 ring-1 ring-green-200";
    case "concluded":
      return "bg-gray-50 text-gray-700 ring-1 ring-gray-200";
    case "cancelled":
      return "bg-red-50 text-red-700 ring-1 ring-red-200";
  }
}

// Convenience: End-to-end mapping from mixed inputs to display info
export function toDisplayFromStatus(status: VotingStatus) {
  const phase = statusToPhase(status);
  return { phase, label: phaseDisplay(phase), badgeClass: phaseBadgeClass(phase) };
}

export function toDisplayFromLabel(label: string) {
  const phase = labelToPhase(label) ?? "upcoming";
  return { phase, label: phaseDisplay(phase), badgeClass: phaseBadgeClass(phase) };
}
