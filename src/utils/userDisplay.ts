/**
 * Données minimales pour afficher un nom ou une initiale utilisateur.
 */
export interface UserDisplayInfo {
  username?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
}

/**
 * Nom affiché : firstname + lastname si présents, sinon email, sinon username, sinon "Utilisateur".
 */
export function getDisplayName(
  user: UserDisplayInfo | null | undefined
): string {
  if (!user) return "Utilisateur";
  if (user.username?.trim()) return user.username.trim();
  const hasName = user.firstname?.trim() && user.lastname?.trim();
  if (hasName) {
    return `${user.firstname!.trim()} ${user.lastname!.trim()}`;
  }
  if (user.email?.trim()) return user.email.trim();
  return "Utilisateur";
}

/**
 * Lettre pour l’avatar : première lettre du username, sinon du firstname, sinon de l’email, sinon "U".
 */
export function getAvatarLetter(
  user: UserDisplayInfo | null | undefined
): string {
  if (!user) return "U";
  if (user.username?.trim()) return user.username.trim()[0].toUpperCase();
  if (user.firstname?.trim()) return user.firstname.trim()[0].toUpperCase();
  if (user.email?.trim()) return user.email.trim()[0].toUpperCase();
  return "U";
}
