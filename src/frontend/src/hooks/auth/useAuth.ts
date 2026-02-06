import { useInternetIdentity } from '../useInternetIdentity';
import { useActor } from '../useActor';

export function useAuth() {
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const { actor } = useActor();

  const isAuthenticated = !!identity;
  const isReady = !!actor && !loginStatus.includes('initializing');

  return {
    isAuthenticated,
    isReady,
    identity,
    login,
    logout: clear,
    loginStatus,
  };
}
