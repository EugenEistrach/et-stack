import { createFileRoute } from '@tanstack/react-router';
import { UsersList } from '@/features/admin/ui/users-list';
export const Route = createFileRoute('/dashboard/admin/users')({
  loader: async () => {
    return {
      crumb: "Users"
    };
  },
  component: UsersList
});