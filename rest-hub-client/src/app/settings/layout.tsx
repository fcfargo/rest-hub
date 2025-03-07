import SidebarSettings from '@/components/layout/sidebarSettings';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="flex flex-grow">
      <SidebarSettings />
      {children}
    </div>
  );
}
