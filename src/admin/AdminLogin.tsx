import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, KeyRound, UserCheck, AlertCircle, ArrowLeft, Cloud } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const {
    adminUser,
    isAuthenticated,
    isAuthorizedAdmin,
    settings,
    loginAdmin,
    logoutAdmin,
    claimAdminOwnership,
    setPage,
    isLoading
  } = useApp();

  const [claimUsername, setClaimUsername] = useState(adminUser?.username || '');
  const [isClaiming, setIsClaiming] = useState(false);

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimUsername.trim()) return;
    setIsClaiming(true);
    try {
      await claimAdminOwnership(claimUsername.trim());
    } finally {
      setIsClaiming(false);
    }
  };

  // State 1: User is not signed in to Puter yet
  if (!isAuthenticated) {
    return (
      <div id="admin-login-screen" className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto shadow-xs">
            <Shield className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Ekta Computer Center
            </h1>
            <p className="text-xs uppercase tracking-wider font-bold text-blue-600">
              Administrative Management Portal
            </p>
            <p className="text-sm text-slate-500 leading-relaxed pt-2">
              Authentication is strictly managed via official Puter.js identity. No insecure hard-coded passwords or plain text credentials.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Cloud className="w-4 h-4 text-blue-600" />
              <span>Puter-Native Security Architecture</span>
            </div>
            <p>
              Click below to authenticate with your Puter account. Your session verifies cloud authorization before granting administrative access.
            </p>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={loginAdmin}
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-blue-700 hover:bg-blue-800 active:scale-95 disabled:opacity-50 shadow-md shadow-blue-700/20 transition-all"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isLoading ? 'Connecting to Puter...' : 'Sign In with Puter Account'}</span>
            </button>

            <button
              type="button"
              onClick={() => setPage('home')}
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-medium text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // State 2: User is signed in to Puter, but center has not yet been claimed / initialized
  if (!settings.isInitialized || settings.authorizedPuterUsers.length === 0) {
    return (
      <div id="admin-claim-screen" className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <UserCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">
              First-Time Admin Setup
            </h2>
            <p className="text-xs uppercase tracking-wider font-bold text-amber-600">
              Ownership Claim
            </p>
            <p className="text-sm text-slate-500 leading-relaxed">
              You are signed in as <strong className="text-slate-800">{adminUser?.username || 'Puter User'}</strong>. Register this account as the authorized administrator for Ekta Computer Center.
            </p>
          </div>

          <form onSubmit={handleClaim} className="space-y-4 text-left">
            <div>
              <label htmlFor="claim-username" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Puter Username or Admin Handle
              </label>
              <input
                id="claim-username"
                type="text"
                required
                value={claimUsername}
                onChange={(e) => setClaimUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <button
              type="submit"
              disabled={isClaiming || !claimUsername.trim()}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-50 transition-all shadow-md"
            >
              {isClaiming ? 'Registering Admin...' : 'Claim & Authorize Admin Account'}
            </button>
          </form>

          <button
            type="button"
            onClick={logoutAdmin}
            className="text-xs text-slate-400 hover:text-slate-600 font-medium"
          >
            Sign out of this Puter account
          </button>
        </div>
      </div>
    );
  }

  // State 3: User is signed in to Puter, but their username is NOT in authorized list
  if (!isAuthorizedAdmin) {
    return (
      <div id="admin-unauthorized-screen" className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-rose-200 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Access Restricted
            </h2>
            <p className="text-xs uppercase tracking-wider font-bold text-rose-600">
              Unauthorized Account
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Signed in as <strong className="text-slate-900">{adminUser?.username || 'Unknown'}</strong>. This account has not been granted management authorization for Ekta Computer Center.
            </p>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={logoutAdmin}
              className="w-full py-3 px-6 rounded-xl font-bold text-sm text-white bg-slate-900 hover:bg-slate-800 transition-all"
            >
              Sign Out & Switch Account
            </button>
            <button
              type="button"
              onClick={() => setPage('home')}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
            >
              Return to Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
