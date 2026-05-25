import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Link } from '@tanstack/react-router';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

export function DashboardCountCard({
  title,
  Icon,
  queryKey,
  queryFn,
  href,
}: {
  title: string;
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  queryKey: string[];
  queryFn: (signal?: AbortSignal) => Promise<number>;
  href?: string;
}) {
  const query = useQuery({
    queryKey,
    queryFn: ({ signal }) => queryFn(signal),
  });

  const card = (
    <Card
      className={href ? 'cursor-pointer transition-shadow hover:shadow-md' : ''}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon ? <Icon className="text-muted-foreground h-4 w-4" /> : ''}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {query.isSuccess ? (
            <span>{query.data}</span>
          ) : (
            <Skeleton className="h-[30px] w-full" />
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link to={href} className="no-underline">
        {card}
      </Link>
    );
  }

  return card;
}
