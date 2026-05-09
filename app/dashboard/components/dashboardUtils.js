export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function getKpiAccent(tone) {
  if (tone === "a") return "before:bg-[var(--amber)] text-[var(--amber)]";
  if (tone === "g") return "before:bg-[var(--green)] text-[var(--green)]";
  if (tone === "c") return "before:bg-[var(--cyan)] text-[var(--cyan)]";
  return "before:bg-[var(--purple)] text-[var(--purple)]";
}

export function getTriggerClass(triggerClass) {
  if (triggerClass === "at-webhook") {
    return "bg-[rgba(34,211,238,0.1)] text-[var(--cyan)]";
  }

  if (triggerClass === "at-schedule") {
    return "bg-[rgba(167,139,250,0.1)] text-[var(--purple)]";
  }

  return "bg-[rgba(245,166,35,0.1)] text-[var(--amber)]";
}

export function getDocBadgeClass(badgeClass) {
  return badgeClass === "db-indexed"
    ? "bg-[rgba(16,185,129,0.1)] text-[var(--green)]"
    : "bg-[rgba(245,166,35,0.1)] text-[var(--amber)]";
}

export function getStatValueClass(className) {
  if (className === "green") return "text-[var(--green)]";
  if (className === "amber") return "text-[var(--amber)]";
  return "";
}
