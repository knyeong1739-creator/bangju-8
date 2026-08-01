import { supabase } from './supabase';
import { UserAccount } from '../types';
import { INITIAL_PROFILE, INITIAL_STATS, INITIAL_PURCHASED_ANIMALS } from '../data/initialData';

// DB row -> UserAccount 형태로 변환
function rowToAccount(row: any): UserAccount {
  return {
    username: row.username,
    password: row.password,
    isDefaultPassword: row.is_default_password,
    isAdmin: row.is_admin,
    isApproved: row.is_approved ?? false,
    minihompyTitle: row.minihompy_title,
    createdAt: row.created_at,
    profile: row.profile,
    stats: row.stats,
    purchasedAnimals: row.purchased_animals,
  };
}

function accountToRow(acc: UserAccount) {
  return {
    username: acc.username,
    password: acc.password,
    is_default_password: acc.isDefaultPassword,
    is_admin: acc.isAdmin,
    is_approved: acc.isApproved,
    minihompy_title: acc.minihompyTitle,
    created_at: acc.createdAt,
    profile: acc.profile,
    stats: acc.stats,
    purchased_animals: acc.purchasedAnimals,
  };
}

export async function loadAllAccounts(): Promise<UserAccount[]> {
  const { data, error } = await supabase.from('accounts').select('*');
  if (error) {
    console.error('계정 로드 실패', error);
    return [];
  }
  return (data ?? []).map(rowToAccount);
}

export async function findAccount(username: string): Promise<UserAccount | null> {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('username', username)
    .maybeSingle();
  if (error || !data) return null;
  return rowToAccount(data);
}

export async function saveSingleAccount(account: UserAccount): Promise<void> {
  const { error } = await supabase
    .from('accounts')
    .upsert(accountToRow(account), { onConflict: 'username' });
  if (error) console.error('계정 저장 실패', error);
}

// 관리자가 미리 등록한 이름인지 확인
export async function isAllowedUser(username: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('allowed_users')
    .select('username')
    .eq('username', username)
    .maybeSingle();
  if (error) return false;
  return !!data;
}

// 최초 로그인 시 계정이 없으면 생성 (허용된 사람만)
export async function createNewAccount(username: string, minihompyTitle?: string): Promise<UserAccount | null> {
  const allowed = await isAllowedUser(username);
  if (!allowed) return null; // 명단에 없으면 생성 거부

  const todayStr = new Date().toISOString().split('T')[0];
  const newAcc: UserAccount = {
    username,
    password: '1234',
    isDefaultPassword: true,
    isAdmin: username === '관리자',
    isApproved: false,
    minihompyTitle: minihompyTitle || `${username}의 방주 타고`,
    createdAt: todayStr,
    profile: { ...INITIAL_PROFILE, name: username, avatarUrl: '' },
    stats: { ...INITIAL_STATS },
    purchasedAnimals: [...INITIAL_PURCHASED_ANIMALS],
  };

  await saveSingleAccount(newAcc);
  return newAcc;
}

// 로그인 시도 (허용 목록 체크 + 계정 없으면 자동 생성 + 비밀번호 확인)
export async function attemptLogin(username: string, password: string): Promise<UserAccount | 'not_allowed' | 'wrong_password' | 'pending'> {
  let account = await findAccount(username);

  if (!account) {
    // 신규 유저 → 계정 생성 + pending 상태로
    const todayStr = new Date().toISOString().split('T')[0];
    const newAcc: UserAccount = {
      username,
      password,
      isDefaultPassword: false,
      isAdmin: false,
      isApproved: false, // 승인 대기
      minihompyTitle: `${username}의 방주 타고`,
      createdAt: todayStr,
      profile: { ...INITIAL_PROFILE, name: username, avatarUrl: '' },
      stats: { ...INITIAL_STATS },
      purchasedAnimals: [...INITIAL_PURCHASED_ANIMALS],
    };
    await saveSingleAccount(newAcc);
    return 'pending';
  }

  if (account.password !== password) return 'wrong_password';
  if (!account.isApproved && !account.isAdmin) return 'pending';
  return account;
}

// 관리자가 새 유저를 허용 목록에 추가
export async function addAllowedUser(username: string): Promise<boolean> {
  const trimmed = username.trim();
  if (!trimmed) return false;

  const { error } = await supabase
    .from('allowed_users')
    .insert({ username: trimmed });

  if (error) {
    console.error('유저 추가 실패', error);
    return false; // 이미 존재하는 이름이면 primary key 충돌로 여기 걸림
  }
  return true;
}

// 허용된 유저 전체 목록 (관리자 탭에서 보여줄 용도)
export async function loadAllowedUsers(): Promise<string[]> {
  const { data, error } = await supabase
    .from('allowed_users')
    .select('username')
    .order('added_at', { ascending: false });
  if (error) return [];
  return (data ?? []).map((row) => row.username);
}

// 허용 목록에서 제거 (선택 기능 — 필요하면 사용)
export async function removeAllowedUser(username: string): Promise<boolean> {
  const { error } = await supabase
    .from('allowed_users')
    .delete()
    .eq('username', username);
  return !error;
}

export async function deleteAccount(username: string): Promise<boolean> {
  const { error } = await supabase.from('accounts').delete().eq('username', username);
  return !error;
}