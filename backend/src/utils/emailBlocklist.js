const BLOCKED_DOMAINS = new Set([
  "mailinator.com",
  "10minutemail.com",
  "tempmail.com",
]);

const getDomain = (email = "") => {
  const atIndex = email.lastIndexOf("@");
  if (atIndex === -1) return "";
  return email.slice(atIndex + 1).toLowerCase().trim();
};

export const isBlockedEmailDomain = (email) => {
  const domain = getDomain(email);
  return BLOCKED_DOMAINS.has(domain);
};

export const blockedEmailDomains = [...BLOCKED_DOMAINS];
