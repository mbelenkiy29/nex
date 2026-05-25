'use client';
import { Link } from '@tanstack/react-router';
import { SidebarTrigger } from '@/shared/components/ui/sidebar';
import { Separator } from '@/shared/components/ui/separator';
import {
  Breadcrumb as BreadcrumbRoot,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/components/ui/breadcrumb';

type BreadcrumbItemType =
  | [string, string, Record<string, any>?]
  | [string, string]
  | [string];

export function PageHeader({ items }: { items?: Array<BreadcrumbItemType> }) {
  if (!items || items.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-vertical:self-auto data-[orientation=vertical]:h-4"
      />
      <BreadcrumbRoot>
        <BreadcrumbList>
          {items.map((item, index) => {
            const isLast = items.length - 1 === index;

            return (
              <div key={item[0]} className="contents">
                <BreadcrumbItem>
                  {item.length > 1 ? (
                    <BreadcrumbLink
                      render={<Link to={item[1]!} search={item[2]} />}
                    >
                      {item[0]}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage data-testid="page-header-title">
                      {item[0]}
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </div>
            );
          })}
        </BreadcrumbList>
      </BreadcrumbRoot>
    </div>
  );
}
