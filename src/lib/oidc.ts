import { UserManager, WebStorageStateStore, User } from 'oidc-client-ts';

const authority = process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER || 'http://localhost:8080/realms/assessment';

const oidcConfig = {
  authority: authority,
  client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'assessment-ui',
  redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/auth/callback`,
  post_logout_redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/login`,
  response_type: 'code',
  scope: 'openid profile email',
  automaticSilentRenew: true,
  silent_redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/auth/silent-callback`,
  userStore: typeof window !== 'undefined' ? new WebStorageStateStore({ store: window.localStorage }) : undefined,
  
  // Remove client_secret for public client (frontend apps should not have secrets)
  // Add loadUserInfo to get user profile information
  loadUserInfo: true,
  
  // Manual endpoint configuration for Keycloak (disable discovery)
  metadataUrl: undefined, // Disable automatic discovery
  metadata: {
    issuer: authority,
    authorization_endpoint: `${authority}/protocol/openid-connect/auth`,
    token_endpoint: `${authority}/protocol/openid-connect/token`,
    userinfo_endpoint: `${authority}/protocol/openid-connect/userinfo`,
    end_session_endpoint: `${authority}/protocol/openid-connect/logout`,
    jwks_uri: `${authority}/protocol/openid-connect/certs`,
  },
};

let userManager: UserManager | null = null;

export const getUserManager = (): UserManager | null => {
  if (typeof window === 'undefined') {
    return null; // Return null on server-side
  }
  
  if (!userManager) {
    try {
      userManager = new UserManager(oidcConfig);
    } catch (error) {
      console.error('Failed to initialize UserManager:', error);
      return null;
    }
  }
  return userManager;
};

export const login = async (): Promise<void> => {
  const userManager = getUserManager();
  if (!userManager) {
    const error = new Error('UserManager not available - check OIDC configuration');
    console.error('Login error:', error);
    throw error;
  }
  
  try {
    console.log('Initiating login with config:', {
      authority: oidcConfig.authority,
      client_id: oidcConfig.client_id,
      redirect_uri: oidcConfig.redirect_uri
    });
    
    await userManager.signinRedirect({
      state: { returnUrl: '/dashboard' }
    });
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  const userManager = getUserManager();
  if (!userManager) {
    throw new Error('UserManager not available on server-side');
  }
  
  try {
    await userManager.signoutRedirect();
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const getUser = async (): Promise<User | null> => {
  const userManager = getUserManager();
  if (!userManager) {
    return null; // Return null on server-side
  }
  
  try {
    return await userManager.getUser();
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
};

export const completeLogin = async (): Promise<User> => {
  const userManager = getUserManager();
  if (!userManager) {
    throw new Error('UserManager not available on server-side');
  }
  
  try {
    return await userManager.signinRedirectCallback();
  } catch (error) {
    console.error('Complete login error:', error);
    throw error;
  }
};

export const renewToken = async (): Promise<User | null> => {
  const userManager = getUserManager();
  if (!userManager) {
    return null; // Return null on server-side
  }
  
  try {
    return await userManager.signinSilent();
  } catch (error) {
    console.error('Token renewal error:', error);
    return null;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  try {
    const user = await getUser();
    return user?.access_token || null;
  } catch (error) {
    console.error('Get access token error:', error);
    return null;
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const user = await getUser();
    return user !== null && !user.expired;
  } catch (error) {
    console.error('Authentication check error:', error);
    return false;
  }
};
