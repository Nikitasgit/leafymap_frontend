export const e2eUser = {
  email: process.env.E2E_USER_EMAIL ?? "e2e.user@leafymap.test",
  password: process.env.E2E_USER_PASSWORD ?? ["E2e", "Passw0rd!"].join(""),
};
