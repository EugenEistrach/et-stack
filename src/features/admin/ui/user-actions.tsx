import { useQueryClient } from '@tanstack/react-query';
import { type UserWithRole } from 'better-auth/plugins';
import { MoreHorizontal, Ban, Key, UserCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { authClient, useAuth } from '@/features/_shared/user/api/auth.api';
import { listUsersQueryOptions } from '@/features/admin/ui/users-list';
export const UserActions = ({
  user
}: {
  user: UserWithRole;
}) => {
  const {
    user: currentUser
  } = useAuth();
  const queryClient = useQueryClient();
  const handleBanUnban = async () => {
    if (user.banned) {
      const result = await authClient.admin.unbanUser({
        userId: user.id
      });
      if (result.error) {
        toast.error(result.error.message);
      }
    } else {
      const result = await authClient.admin.banUser({
        userId: user.id
      });
      if (result.error) {
        toast.error(result.error.message);
      }
    }
    await queryClient.invalidateQueries(listUsersQueryOptions());
  };
  const handleRevokeAllSessions = async () => {
    const result = await authClient.admin.revokeUserSessions({
      userId: user.id
    });
    if (result.error) {
      toast.error(result.error.message);
    } else {
      toast.success('Sessions revoked');
    }
    await queryClient.invalidateQueries(listUsersQueryOptions());
  };
  const handleImpersonate = async () => {
    const result = await authClient.admin.impersonateUser({
      userId: user.id
    });
    if (result.error) {
      toast.error(result.error.message);
    }
    window.location.reload();
  };
  return <DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="h-8 w-8 p-0" disabled={user.id === currentUser.id}>
					<span className="sr-only">Open menu</span>
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Actions</DropdownMenuLabel>
				<DropdownMenuItem onClick={handleBanUnban}>
					<Ban className="mr-2 h-4 w-4" />
					{user.banned ? "Unban" : "Ban"}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={handleRevokeAllSessions}>
					<Key className="mr-2 h-4 w-4" />
					Revoke All Sessions
				</DropdownMenuItem>
				<DropdownMenuItem onClick={handleImpersonate}>
					<UserCircle className="mr-2 h-4 w-4" />
					Impersonate
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>;
};