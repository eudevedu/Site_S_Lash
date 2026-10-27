export function canManageUsers(profile) {
  return profile?.role === 'superadmin'
}
export function canDeleteUser(profile, currentUserId, targetUserId) {
  return canManageUsers(profile) && Boolean(currentUserId && targetUserId) && currentUserId !== targetUserId
}
