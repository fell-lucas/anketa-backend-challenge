import { Role } from '@repo/system/iam/roles'

const baseFirebaseProperties = {
  aud: '',
  auth_time: 0,
  exp: 0,
  firebase: {
    identities: {},
    sign_in_provider: '',
    sign_in_second_factor: '',
    second_factor_identifier: '',
    tenant: '',
  },
  iat: 0,
  iss: '',
  sub: '',
}

export const TEST_ADMIN_1 = {
  token: 'token_admin1',
  uid: 'admin1',
  sub: 'admin1',
  appId: '11111111-1111-1111-1111-111111111111',
  email: 'test@test.com',
  name: 'Test User',
  picture: 'https://test.com/test.png',
  role: Role.ADMIN,
  ...baseFirebaseProperties,
}

export const TEST_USER_NOT_REGISTERED = {
  token: 'token_user_not_registered',
  uid: 'user0',
  sub: 'user0',
  name: 'None',
  email: 'none+1@foo.bar',
  ...baseFirebaseProperties,
}

export const TEST_USER_1 = {
  token: 'token_user1',
  uid: 'user1',
  sub: 'user1',
  appId: '22222222-2222-2222-2222-222222222222',
  username: 'kushal',
  phoneNumber: '+393289229551',
  name: 'Kush',
  email: 'kush@foo.bar',
  ...baseFirebaseProperties,
}

export const TEST_USER_1_NOT_REGISTERED_BUT_SAME_EMAIL = {
  token: 'token_user1_not_registered',
  uid: 'user1-bis',
  sub: 'user1-bis',
  name: 'None',
  email: 'kush@foo.bar',
  ...baseFirebaseProperties,
}

export const TEST_USER_1_BUT_CHANGED_EMAIL = {
  ...TEST_USER_1,
  token: 'token_user1_change_email',
  email: 'kush2@foo.bar',
}

export const TEST_USER_2 = {
  token: 'token_user2',
  uid: 'user2',
  sub: 'user2',
  appId: '33333333-3333-3333-3333-333333333333',
  username: 'user2',
  name: 'User 2',
  email: 'user2@foo.bar',
  ...baseFirebaseProperties,
}

export const TEST_USER_2_BUT_CHANGED_EMAIL_CONFLICT = {
  ...TEST_USER_2,
  token: 'token_user2_conflict_email',
  email: TEST_USER_1.email,
}

export const TEST_USER_3 = {
  token: 'token_user3',
  uid: 'user3',
  sub: 'user3',
  appId: '44444444-4444-4444-4444-444444444444',
  username: 'user3',
  name: 'User 3',
  email: 'user3@foo.bar',
  ...baseFirebaseProperties,
}

export const TEST_USER_4 = {
  token: 'token_user4',
  uid: 'user4',
  sub: 'user4',
  appId: '55555555-5555-5555-5555-555555555555',
  username: 'testuser4',
  name: 'Test User 4',
  email: 'testuser4@test.com',
  ...baseFirebaseProperties,
}

export const TEST_USER_5 = {
  token: 'token_user5',
  uid: 'user5',
  sub: 'user5',
  appId: '66666666-6666-6666-6666-666666666666',
  username: 'testuser5',
  name: 'Test User 5',
  email: 'testuser5@test.com',
  ...baseFirebaseProperties,
}

export const TEST_USER_6 = {
  token: 'token_user6',
  uid: 'user6',
  sub: 'user6',
  appId: '77777777-7777-7777-7777-777777777777',
  username: 'testuser6',
  name: 'Test User 6',
  email: 'testuser6@test.com',
  ...baseFirebaseProperties,
}
