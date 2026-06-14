import type { ReactNode } from 'react';

interface SidebarLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
}

export const SidebarLayout = ({ children, sidebar }: SidebarLayoutProps) => (
  <div className="flex gap-6 lg:gap-8">
    <div className="min-w-0 flex-1">{children}</div>
    <aside className="hidden xl:block w-80 shrink-0">
      <div className="sticky top-24 space-y-5">
        {sidebar}
      </div>
    </aside>
  </div>
);
