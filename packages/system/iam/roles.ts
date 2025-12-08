export enum Role {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  USER = 'user',
  OPERATOR = 'operator',
  ENGINEER = 'engineer',
  MANAGER = 'manager',
}

export const roleHierarchy = {
  [Role.SUPER_ADMIN]: [
    Role.ADMIN,
    Role.USER,
    Role.OPERATOR,
    Role.ENGINEER,
    Role.MANAGER,
  ],
  [Role.ADMIN]: [Role.USER, Role.OPERATOR, Role.ENGINEER, Role.MANAGER],
  [Role.MANAGER]: [Role.ENGINEER, Role.OPERATOR, Role.USER],
  [Role.ENGINEER]: [Role.OPERATOR, Role.USER],
  [Role.OPERATOR]: [Role.USER],
  [Role.USER]: [Role.OPERATOR],
};
