/**
 * 소셜 로그인 시작 (OAuth2 인증 요청)
 * @param provider 'google'
 */
export const startSocialLogin = (provider: string) => {
  window.location.href = `${process.env.NEXT_PUBLIC_API_NIP_URL}/oauth2/authorization/${provider}`;
};
