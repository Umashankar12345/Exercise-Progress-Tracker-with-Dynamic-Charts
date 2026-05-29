import React from 'react';
import { Settings as SettingsIcon, Bell, Shield, User, Globe, Moon, CreditCard, ChevronRight, Zap } from 'lucide-react';

const SETTING_SECTIONS = [
  {
    title: 'Account',
    items: [
      { label: 'Profile Information', icon: User, desc: 'Update your personal details and avatar' },
      { label: 'Subscription & Billing', icon: CreditCard, desc: 'Manage your Pro plan and invoices', badge: 'PRO' },
      { label: 'Privacy & Security', icon: Shield, desc: 'Change password and 2FA settings' },
    ]
  },
  {
    title: 'Preferences',
    items: [
      { label: 'Notifications', icon: Bell, desc: 'Configure workout reminders and AI alerts' },
      { label: 'Display & Theme', icon: Moon, desc: 'Switch between dark, light, and system modes' },
      { label: 'Region & Units', icon: Globe, desc: 'Imperial vs Metric and timezone settings' },
    ]
  }
];

export default function Settings() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      {/* Settings Header */}
      <div className="flex items-center gap-6 p-8 rounded-3xl bg-surface-container border border-outline-variant">
        <div className="w-16 h-16 bg-surface-bright rounded-2xl flex items-center justify-center border border-outline-variant">
          <SettingsIcon className="w-8 h-8 text-on-surface-variant" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tighter uppercase">Application Settings</h1>
          <p className="text-on-surface-variant font-medium">Control your privacy, alerts, and system configurations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation Sidebar */}
        <div className="space-y-2">
          {['Account', 'Security', 'Notifications', 'Billing', 'Integrations', 'System'].map((item, i) => (
            <button 
              key={i}
              className={`w-full flex items-center justify-between p-4 rounded-xl text-sm font-bold transition-all ${
                i === 0 ? 'bg-primary/10 border border-primary/20 text-primary' : 'text-on-surface-variant hover:bg-surface-bright hover:text-on-surface'
              }`}
            >
              {item}
              {i === 3 && <span className="text-[9px] font-black bg-secondary text-surface px-1.5 py-0.5 rounded-md">NEW</span>}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-8">
          {SETTING_SECTIONS.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant px-2">{section.title}</h2>
              <div className="glass-card divide-y divide-outline-variant">
                {section.items.map((item, i) => (
                  <button key={i} className="w-full p-6 flex items-center gap-4 hover:bg-surface-bright transition-all group first:rounded-t-2xl last:rounded-b-2xl">
                    <div className="p-3 bg-surface-bright border border-outline-variant rounded-xl text-on-surface-variant group-hover:text-primary transition-colors">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-on-surface">{item.label}</span>
                        {item.badge && <span className="text-[9px] font-black bg-primary text-white px-1.5 py-0.5 rounded-md">{item.badge}</span>}
                      </div>
                      <p className="text-xs text-on-surface-variant font-medium">{item.desc}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-on-surface-variant group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Danger Zone */}
          <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/10 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-red-500" />
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Danger Zone</span>
            </div>
            <p className="text-xs font-bold text-on-surface-variant leading-relaxed">
              Deleting your account will permanently remove all training data, AI history, and subscription access. This action cannot be undone.
            </p>
            <button className="px-6 py-2.5 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-black rounded-xl hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest">
              DELETE ACCOUNT DATA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
