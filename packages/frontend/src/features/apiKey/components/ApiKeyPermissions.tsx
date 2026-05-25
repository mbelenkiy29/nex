import { Badge } from '@/shared/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { useAuthStore } from '@/features/auth/authStore';

interface ApiKeyPermissionsProps {
  permissions: string | Record<string, string[]> | null;
}

export function ApiKeyPermissions({ permissions }: ApiKeyPermissionsProps) {
  const dictionary = useAuthStore((state) => state.dictionary);

  // No permissions means all permissions allowed
  if (!permissions) {
    return (
      <Badge variant="secondary" className="font-normal">
        {dictionary.shared.all}
      </Badge>
    );
  }

  try {
    let parsedPermissions: Record<string, string[]>;

    if (typeof permissions === 'string') {
      parsedPermissions = JSON.parse(permissions) as Record<string, string[]>;
    } else {
      parsedPermissions = permissions as any;
    }

    const permissionList: string[] = [];
    for (const [resource, actions] of Object.entries(parsedPermissions)) {
      for (const action of actions) {
        permissionList.push(`${resource}:${action}`);
      }
    }

    // Empty permissions object also means all permissions
    if (permissionList.length === 0) {
      return (
        <Badge variant="secondary" className="font-normal">
          {dictionary.shared.all}
        </Badge>
      );
    }

    const permissionCount = permissionList.length;

    return (
      <Popover>
        <PopoverTrigger
          nativeButton={false}
          render={
            <Badge
              variant="secondary"
              className="hover:bg-secondary/80 cursor-pointer font-normal"
            />
          }
        >
          {permissionCount}{' '}
          {permissionCount === 1
            ? dictionary.apiKey.enumerators.permissions.permission
            : dictionary.apiKey.enumerators.permissions.permissions}
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="flex flex-wrap gap-1">
            {permissionList.map((permission) => (
              <Badge key={permission} variant="outline" className="font-normal">
                {permission}
              </Badge>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    );
  } catch (error) {
    console.error(error);
    return (
      <Badge variant="destructive" className="font-normal">
        {dictionary.apiKey.enumerators.permissions.invalid}
      </Badge>
    );
  }
}
