import SettingsSidebar from '@/app/settings/components/settingsSidebar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="flex flex-grow">
      <ProtectedRoute>
        <SettingsSidebar />
        {children}
      </ProtectedRoute>
    </div>
  );
}
