import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Lock, 
  User, 
  Mail, 
  Shield, 
  Palette, 
  Globe, 
  Moon, 
  Sun,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';

const SettingsPanel = ({ user }) => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      bookingReminders: true,
      promotions: false,
      venueUpdates: true,
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
    },
    account: {
      name: user?.name || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    appearance: {
      theme: 'dark',
      language: 'en',
    },
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [activeSection, setActiveSection] = useState('notifications');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    alert('Settings saved successfully!');
  };

  const sections = [
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'primary' },
    { id: 'privacy', label: 'Privacy', icon: Shield, color: 'accent2' },
    { id: 'account', label: 'Account', icon: User, color: 'success' },
    { id: 'appearance', label: 'Appearance', icon: Palette, color: 'accent1' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-heading font-bold mb-6 gradient-text">Settings</h2>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-3 mb-6">
        {sections.map((section) => (
          <motion.button
            key={section.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition ${
              activeSection === section.id
                ? `bg-${section.color}/20 text-${section.color} border-2 border-${section.color}/50`
                : 'glass text-neutral hover:text-primary border border-transparent'
            }`}
          >
            <section.icon className="w-4 h-4" />
            {section.label}
          </motion.button>
        ))}
      </div>

      {/* Notifications Section */}
      {activeSection === 'notifications' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="glass rounded-xl p-6 border border-primary/20">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notification Preferences
            </h3>
            <div className="space-y-4">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <label
                  key={key}
                  className="flex items-center justify-between p-3 glass rounded-lg cursor-pointer hover:bg-primary/5 transition"
                >
                  <div>
                    <span className="text-white font-semibold block capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-muted text-sm">
                      {key === 'email' && 'Receive notifications via email'}
                      {key === 'bookingReminders' && 'Get reminders before your bookings'}
                      {key === 'promotions' && 'Receive promotional offers and discounts'}
                      {key === 'venueUpdates' && 'Get updates about your favorite venues'}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          notifications: {
                            ...settings.notifications,
                            [key]: e.target.checked,
                          },
                        })
                      }
                      className="w-12 h-6 rounded-full appearance-none bg-neutral/20 cursor-pointer transition-colors checked:bg-primary relative"
                    />
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </label>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Privacy Section */}
      {activeSection === 'privacy' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="glass rounded-xl p-6 border border-accent2/20">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent2" />
              Privacy Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-neutral mb-2">Profile Visibility</label>
                <select
                  value={settings.privacy.profileVisibility}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      privacy: {
                        ...settings.privacy,
                        profileVisibility: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-secondary/50 border border-neutral/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent2"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="friends">Friends Only</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 glass rounded-lg cursor-pointer">
                  <span className="text-white font-semibold">Show Email Address</span>
                  <input
                    type="checkbox"
                    checked={settings.privacy.showEmail}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        privacy: {
                          ...settings.privacy,
                          showEmail: e.target.checked,
                        },
                      })
                    }
                    className="w-12 h-6 rounded-full appearance-none bg-neutral/20 cursor-pointer transition-colors checked:bg-accent2 relative"
                  />
                </label>
                <label className="flex items-center justify-between p-3 glass rounded-lg cursor-pointer">
                  <span className="text-white font-semibold">Show Phone Number</span>
                  <input
                    type="checkbox"
                    checked={settings.privacy.showPhone}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        privacy: {
                          ...settings.privacy,
                          showPhone: e.target.checked,
                        },
                      })
                    }
                    className="w-12 h-6 rounded-full appearance-none bg-neutral/20 cursor-pointer transition-colors checked:bg-accent2 relative"
                  />
                </label>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Account Section */}
      {activeSection === 'account' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="glass rounded-xl p-6 border border-success/20">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-success" />
              Account Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-neutral mb-2">Full Name</label>
                <input
                  type="text"
                  value={settings.account.name}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      account: { ...settings.account, name: e.target.value },
                    })
                  }
                  className="w-full bg-secondary/50 border border-neutral/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-success"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral mb-2">Email Address</label>
                <input
                  type="email"
                  value={settings.account.email}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      account: { ...settings.account, email: e.target.value },
                    })
                  }
                  className="w-full bg-secondary/50 border border-neutral/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-success"
                />
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-6 border border-success/20">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-success" />
              Change Password
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-neutral mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={settings.account.currentPassword}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        account: { ...settings.account, currentPassword: e.target.value },
                      })
                    }
                    className="w-full bg-secondary/50 border border-neutral/20 rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:border-success"
                  />
                  <button
                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral hover:text-white"
                  >
                    {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={settings.account.newPassword}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        account: { ...settings.account, newPassword: e.target.value },
                      })
                    }
                    className="w-full bg-secondary/50 border border-neutral/20 rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:border-success"
                  />
                  <button
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral hover:text-white"
                  >
                    {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral mb-2">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={settings.account.confirmPassword}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        account: { ...settings.account, confirmPassword: e.target.value },
                      })
                    }
                    className="w-full bg-secondary/50 border border-neutral/20 rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:border-success"
                  />
                  <button
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral hover:text-white"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Appearance Section */}
      {activeSection === 'appearance' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="glass rounded-xl p-6 border border-accent1/20">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-accent1" />
              Appearance Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-neutral mb-2">Theme</label>
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, theme: 'dark' },
                      })
                    }
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-bold transition ${
                      settings.appearance.theme === 'dark'
                        ? 'bg-accent1/20 text-accent1 border-2 border-accent1/50'
                        : 'glass text-neutral hover:text-accent1'
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                    Dark
                  </button>
                  <button
                    onClick={() =>
                      setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, theme: 'light' },
                      })
                    }
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-bold transition ${
                      settings.appearance.theme === 'light'
                        ? 'bg-accent1/20 text-accent1 border-2 border-accent1/50'
                        : 'glass text-neutral hover:text-accent1'
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                    Light
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral mb-2">Language</label>
                <select
                  value={settings.appearance.language}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      appearance: {
                        ...settings.appearance,
                        language: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-secondary/50 border border-neutral/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent1"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Save Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
        disabled={saving}
        className="w-full btn-glow bg-gradient-primary text-secondary py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-glow disabled:opacity-50"
      >
        <Save className="w-5 h-5" />
        {saving ? 'Saving...' : 'Save Settings'}
      </motion.button>
    </div>
  );
};

export default SettingsPanel;

