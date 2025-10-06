import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Building, Bell, Shield, Palette, Database, LucideIcon } from 'lucide-react';
import { UserProfileSettings } from './UserProfileSettings';
import { BusinessSettings } from './BusinessSettings';
import { NotificationSettings } from './NotificationSettings';
import { SecuritySettings } from './SecuritySettings';
import { ThemeSettings } from './ThemeSettings';
import { SystemSettings } from './SystemSettings';

interface Section {
  id: string;
  label: string;
  icon: LucideIcon;
  component: React.ComponentType;
}

export const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('profile');

  const sections: Section[] = [
    { id: 'profile', label: 'User Profile', icon: User, component: UserProfileSettings },
    { id: 'business', label: 'Business Info', icon: Building, component: BusinessSettings },
    { id: 'notifications', label: 'Notifications', icon: Bell, component: NotificationSettings },
    { id: 'security', label: 'Security', icon: Shield, component: SecuritySettings },
    { id: 'theme', label: 'Theme & Appearance', icon: Palette, component: ThemeSettings },
    { id: 'system', label: 'System', icon: Database, component: SystemSettings },
  ];

  const renderActiveComponent = () => {
    const section = sections.find(s => s.id === activeSection);
    if (!section) return <UserProfileSettings />;
    const Component = section.component;
    return <Component />;
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 p-4">
        <div className="flex items-center gap-2 mb-6">
          <SettingsIcon className="text-slate-600" size={24} />
          <h2 className="text-xl font-semibold text-slate-800">Settings</h2>
        </div>

        <nav className="space-y-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{section.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {renderActiveComponent()}
      </div>
    </div>
  );
};
