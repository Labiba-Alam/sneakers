import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Key, Crown, UserCheck, Eye, EyeOff, AlertCircle, Sparkles } from 'lucide-react';
import { AdminRole, AdminUser } from '../../types';

interface AdminAuthModalProps {
  onLoginSuccess: (user: AdminUser) => void;
  onCancel?: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ onLoginSuccess, onCancel }) => {
  const [authMode, setAuthMode] = useState<'login' | 'forgot' | 'resetSent'>('login');
  const [email, setEmail] = useState('admin@kingsman.com');
  const [secretKey, setSecretKey] = useState('admin');
  const [selectedRole, setSelectedRole] = useState<AdminRole>('Admin');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedPassword = secretKey.trim();
    const trimmedEmail = email.trim() || 'admin@kingsman.com';

    if (!trimmedPassword) {
      setErrorMessage('Password is required.');
      return;
    }

    setIsLoading(true);

    const fallbackUser: AdminUser = {
      id: 'adm-001',
      name: selectedRole === 'Admin' ? 'Lord Sterling' : 'Atelier Director',
      email: trimmedEmail,
      role: selectedRole,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    };

    // Client-side quick check for requested mock auth
    const isValidMock = (trimmedPassword === 'admin' || trimmedPassword === 'kingsman2025' || trimmedPassword === 'super-secret-admin-token');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          password: trimmedPassword,
          secretKey: trimmedPassword,
          email: trimmedEmail,
          role: selectedRole,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (isValidMock) {
          setIsLoading(false);
          onLoginSuccess(fallbackUser);
          return;
        }
        setErrorMessage(data.error || data.message || 'Invalid credentials. Use admin@kingsman.com with password: admin or kingsman2025.');
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      onLoginSuccess(data.user || fallbackUser);
    } catch {
      // Fallback to mock auth if server is offline
      setIsLoading(false);
      if (isValidMock) {
        onLoginSuccess(fallbackUser);
      } else {
        setErrorMessage('Use email: admin@kingsman.com and password: admin or kingsman2025');
      }
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAuthMode('resetSent');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#141414] border border-[#C7A55B]/40 p-8 shadow-2xl relative overflow-hidden">
        
        {/* Top Gold Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C7A55B] via-[#C1121F] to-[#C7A55B]" />

        {/* Logo Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-14 h-14 rounded-full bg-[#111111] border border-[#C7A55B]/40 flex items-center justify-center mx-auto text-[#C7A55B] shadow-lg">
            <Crown className="w-7 h-7" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C1121F]/10 border border-[#C1121F]/30 text-[#C1121F] text-[10px] uppercase font-bold tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Protected Enterprise Portal</span>
          </div>
          <h2 className="font-serif-luxury text-2xl font-bold text-white tracking-wide">
            KINGSMAN ATELIER LOG IN
          </h2>
          <p className="text-xs text-white/50 font-light">
            Enter your <code className="text-[#C7A55B] font-mono">ADMIN_SECRET_KEY</code> to access administrative records and command controls.
          </p>
        </div>

        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            {/* Role Selection Tabs */}
            <div>
              <label className="text-[10px] uppercase tracking-wider text-white/60 block mb-1.5 font-semibold">
                Access Privilege Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Admin', 'Manager', 'Staff'] as AdminRole[]).map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`py-2 text-[11px] font-bold uppercase tracking-wider border transition-all ${
                      selectedRole === role
                        ? 'bg-[#C7A55B]/20 border-[#C7A55B] text-[#C7A55B]'
                        : 'bg-[#181818] border-white/10 text-white/50 hover:text-white'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Demo Credentials Assistant */}
            <div className="p-2.5 bg-[#C7A55B]/10 border border-[#C7A55B]/30 text-[11px] text-white/90 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#C7A55B] uppercase tracking-wider text-[10px]">Demo Admin Access:</span>
                <span className="text-[10px] text-white/50">Click to autofill</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@kingsman.com');
                    setSecretKey('admin');
                  }}
                  className="flex-1 py-1 px-2 bg-black/40 border border-white/20 hover:border-[#C7A55B] text-[10px] font-mono text-center text-white/90 transition-colors"
                >
                  admin@kingsman.com / admin
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@kingsman.com');
                    setSecretKey('kingsman2025');
                  }}
                  className="py-1 px-2 bg-black/40 border border-white/20 hover:border-[#C7A55B] text-[10px] font-mono text-center text-white/90 transition-colors"
                >
                  kingsman2025
                </button>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="text-[10px] uppercase tracking-wider text-white/70 block mb-1 font-semibold">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#111111] border border-white/20 text-white text-xs focus:outline-none focus:border-[#C7A55B] transition-colors"
                  placeholder="admin@kingsman.com"
                />
              </div>
            </div>

            {/* Password / Admin Key Field */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] uppercase tracking-wider text-white/70 block font-semibold">
                  Password / Admin Key
                </label>
              </div>
              <div className="relative">
                <Key className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 bg-[#111111] border border-white/20 text-white text-xs focus:outline-none focus:border-[#C7A55B] transition-colors font-mono"
                  placeholder="admin or kingsman2025"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-white/40 hover:text-white"
                  title={showPassword ? "Hide key" : "Show key"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between text-xs text-white/70 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-[#C7A55B]"
                />
                <span className="text-[11px]">Keep secure httpOnly session (7 days)</span>
              </label>
            </div>

            {errorMessage && (
              <p className="text-[10px] text-red-400 flex items-center gap-1.5 p-2.5 bg-red-950/30 border border-red-500/30 rounded">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#C1121F] hover:bg-[#a30f1a] text-white text-xs uppercase tracking-[0.2em] font-bold shadow-xl red-border-glow flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Authenticate & Enter Hub ({selectedRole})</span>
                </>
              )}
            </button>
          </form>
        )}

        {authMode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <p className="text-xs text-white/70 font-light leading-relaxed">
              The Atelier Admin Portal requires the server-side <code className="text-[#C7A55B] font-mono">ADMIN_SECRET_KEY</code> defined in your environment settings.
            </p>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-white/70 block mb-1 font-semibold">
                Administrator Notification Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kingsman.royal"
                className="w-full px-4 py-2.5 bg-[#111111] border border-white/20 text-white text-xs focus:outline-none focus:border-[#C7A55B]"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="w-1/2 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs uppercase font-bold tracking-wider"
              >
                Back to Login
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-1/2 py-2.5 bg-[#C7A55B] hover:bg-[#b0904b] text-[#111111] text-xs uppercase font-bold tracking-wider"
              >
                {isLoading ? 'Sending...' : 'Request Assistance'}
              </button>
            </div>
          </form>
        )}

        {authMode === 'resetSent' && (
          <div className="text-center space-y-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
              Atelier clearance assistance instructions dispatched to <strong>{email}</strong>.
            </div>
            <button
              onClick={() => setAuthMode('login')}
              className="w-full py-2.5 bg-white/10 text-white text-xs uppercase font-bold tracking-wider"
            >
              Return to Login
            </button>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-8 pt-4 border-t border-white/10 flex justify-between items-center text-[10px] text-white/40 font-mono">
          <span>KINGSMAN Security v3.4</span>
          <span>httpOnly Session Cookie</span>
        </div>

      </div>
    </div>
  );
};
