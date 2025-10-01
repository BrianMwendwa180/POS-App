import React, { useState } from 'react';
import { User, Lock, Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const LoginForm: React.FC = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('demo@tirepoint.com');
  const [password, setPassword] = useState('demo123');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login, register, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isRegisterMode) {
      // Registration validation
      if (name.trim().length < 2) {
        setError('Name must be at least 2 characters long');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      try {
        await register(name.trim(), email, password, role);
        setSuccess('Account created successfully! You are now logged in.');
        // Reset form
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setRole('user');
      } catch (error: any) {
        setError(error.message || 'Registration failed');
      }
    } else {
      // Login
      try {
        await login(email, password);
      } catch (error: any) {
        setError(error.message || 'Login failed');
      }
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setError('');
    setSuccess('');
    // Reset form when switching modes
    if (!isRegisterMode) {
      setName('');
      setConfirmPassword('');
      setRole('user');
    }
  };

  const resetForm = () => {
    setEmail('demo@tirepoint.com');
    setPassword('demo123');
    setName('');
    setConfirmPassword('');
    setRole('user');
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">TirePoint POS</h1>
          <p className="text-slate-600 mt-2">
            {isRegisterMode ? 'Create your account' : 'Sign in to your account'}
          </p>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 text-sm">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegisterMode && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="user">Normal User</option>
                  <option value="cashier">Cashier</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder={isRegisterMode ? "Create a password (min 6 characters)" : "Enter your password"}
              />
            </div>
          </div>

          {isRegisterMode && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Confirm your password"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading
              ? (isRegisterMode ? 'Creating Account...' : 'Signing in...')
              : (isRegisterMode ? 'Create Account' : 'Sign In')
            }
          </button>
        </form>

        {/* Toggle between Login/Register */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={toggleMode}
            className="text-orange-500 hover:text-orange-600 text-sm font-medium transition-colors"
          >
            {isRegisterMode ? (
              <div className="flex items-center justify-center gap-2">
                <ArrowLeft size={16} />
                Back to Sign In
              </div>
            ) : (
              "Don't have an account? Create one"
            )}
          </button>
        </div>

        {!isRegisterMode && (
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600 text-center">Demo Credentials:</p>
            <p className="text-xs text-slate-500 text-center mt-1">
              Email: demo@tirepoint.com<br />
              Password: demo123
            </p>
            <div className="mt-2 text-center">
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-orange-500 hover:text-orange-600 underline"
              >
                Use Demo Credentials
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};