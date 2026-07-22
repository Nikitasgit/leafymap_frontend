/**
 * Asks the user to confirm twice (destructive actions).
 * Returns true only if both prompts are accepted.
 */
export function confirmTwice(messages: {
  first: string;
  second: string;
}): boolean {
  if (typeof window === "undefined") return false;
  return window.confirm(messages.first) && window.confirm(messages.second);
}
