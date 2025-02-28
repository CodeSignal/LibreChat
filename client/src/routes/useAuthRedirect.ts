import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '~/hooks';

export default function useAuthRedirect() {
  const { user, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isAuthenticated) {
        const currentPath = document.location.pathname + document.location.search;
        let loginPath = "/login";
        if (!currentPath.startsWith('/login')) {
          loginPath = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }

        navigate(loginPath, { replace: true });
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [isAuthenticated, navigate]);

  return {
    user,
    isAuthenticated,
  };
}
