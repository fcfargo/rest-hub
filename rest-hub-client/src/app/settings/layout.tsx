import SettingsSidebar from '@/app/settings/components/settingsSidebar';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="flex flex-grow">
      <SettingsSidebar />
      {children}
    </div>
  );
}
