import { useAuthStore } from '@/features/auth/authStore';

export const buildPageTitle = (title?: string) => {
  const { dictionary, config } = useAuthStore.getState();
  const projectName =
    config?.organizationForBranding?.name || dictionary.projectName;
  return title ? `${title} | ${projectName}` : projectName;
};
