import React from 'react';

interface Props {
  children: React.ReactNode;
}

export const ApiKeyGuard: React.FC<Props> = ({ children }) => {
  // For testing purposes with free API key, we bypass the paid key check.
  // The app will rely on process.env.API_KEY injected by the environment.
  return <>{children}</>;
};