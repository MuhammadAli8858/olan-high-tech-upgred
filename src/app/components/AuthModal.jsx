import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react';
import { BaseModal } from './BaseModal.jsx';
import { useSite } from '../context/SiteContext.jsx';
import { postJson } from '../lib/api.js';

const initialLogin = { email: '', password: '' };
const initialRegister = { name: '', email: '', phone: '', password: '', confirmPassword: '' };

export function AuthModal({ isOpen, onClose }) {
  const { text, setUser } = useSite();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState(initialLogin);
  const [registerData, setRegisterData] = useState(initialRegister);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginChange = (field) => (event) => {
    setLoginData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleRegisterChange = (field) => (event) => {
    setRegisterData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const loginLocalFallback = () => {
    const users = JSON.parse(localStorage.getItem('olan-demo-users') || '[]');
    const user = users.find((item) => item.email.toLowerCase() === loginData.email.toLowerCase() && item.password === loginData.password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    setUser({ name: user.name, email: user.email, phone: user.phone });
  };

  const registerLocalFallback = () => {
    const users = JSON.parse(localStorage.getItem('olan-demo-users') || '[]');
    if (users.some((item) => item.email.toLowerCase() === registerData.email.toLowerCase())) {
      throw new Error('User with this email already exists');
    }
    const nextUsers = [...users, registerData];
    localStorage.setItem('olan-demo-users', JSON.stringify(nextUsers));
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setInfo('');
    setIsSubmitting(true);
    try {
      const response = await postJson('/api/login', loginData);
      setUser(response.user);
      setInfo(text.auth.loginSuccess);
      setTimeout(onClose, 400);
    } catch (apiError) {
      try {
        loginLocalFallback();
        setInfo(text.auth.loginSuccess);
        setTimeout(onClose, 400);
      } catch {
        setError(apiError.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setInfo('');

    if (registerData.password !== registerData.confirmPassword) {
      setError(text.auth.passwordMismatch);
      return;
    }

    setIsSubmitting(true);
    try {
      await postJson('/api/register', registerData);
      setInfo(text.auth.registerSuccess);
      setRegisterData(initialRegister);
      setIsLogin(true);
    } catch (apiError) {
      try {
        registerLocalFallback();
        setInfo(text.auth.registerSuccess);
        setRegisterData(initialRegister);
        setIsLogin(true);
      } catch {
        setError(apiError.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={isLogin ? text.auth.loginTitle : text.auth.registerTitle}>
      <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1 dark:bg-slate-900">
        <button type="button" onClick={() => setIsLogin(true)} className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${isLogin ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' : 'text-slate-500 dark:text-slate-400'}`}>
          {text.auth.switchToLogin}
        </button>
        <button type="button" onClick={() => setIsLogin(false)} className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${!isLogin ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' : 'text-slate-500 dark:text-slate-400'}`}>
          {text.auth.switchToRegister}
        </button>
      </div>
      <p className="mb-6 text-sm leading-7 text-slate-500 dark:text-slate-400">
        {isLogin ? text.auth.loginDescription : text.auth.registerDescription}
      </p>

      {error ? <div className="mb-4 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">{error}</div> : null}
      {info ? <div className="mb-4 rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">{info}</div> : null}

      {isLogin ? (
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input type="email" required value={loginData.email} onChange={handleLoginChange('email')} placeholder={text.contact.email} className="w-full rounded-2xl border border-cyan-500/15 bg-slate-50 py-3 pl-12 pr-4 text-slate-900 outline-none focus:border-cyan-500 dark:bg-slate-900 dark:text-white" />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input type={showPassword ? 'text' : 'password'} required value={loginData.password} onChange={handleLoginChange('password')} placeholder={text.auth.password} className="w-full rounded-2xl border border-cyan-500/15 bg-slate-50 py-3 pl-12 pr-12 text-slate-900 outline-none focus:border-cyan-500 dark:bg-slate-900 dark:text-white" />
            <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <button disabled={isSubmitting} type="submit" className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-70">
            {text.auth.submitLogin}
          </button>
        </form>
      ) : (
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input required value={registerData.name} onChange={handleRegisterChange('name')} placeholder={text.auth.name} className="w-full rounded-2xl border border-cyan-500/15 bg-slate-50 py-3 pl-12 pr-4 text-slate-900 outline-none focus:border-cyan-500 dark:bg-slate-900 dark:text-white" />
          </div>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input type="email" required value={registerData.email} onChange={handleRegisterChange('email')} placeholder={text.contact.email} className="w-full rounded-2xl border border-cyan-500/15 bg-slate-50 py-3 pl-12 pr-4 text-slate-900 outline-none focus:border-cyan-500 dark:bg-slate-900 dark:text-white" />
          </div>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input required value={registerData.phone} onChange={handleRegisterChange('phone')} placeholder={text.contact.phone} className="w-full rounded-2xl border border-cyan-500/15 bg-slate-50 py-3 pl-12 pr-4 text-slate-900 outline-none focus:border-cyan-500 dark:bg-slate-900 dark:text-white" />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input type={showPassword ? 'text' : 'password'} required value={registerData.password} onChange={handleRegisterChange('password')} placeholder={text.auth.password} className="w-full rounded-2xl border border-cyan-500/15 bg-slate-50 py-3 pl-12 pr-12 text-slate-900 outline-none focus:border-cyan-500 dark:bg-slate-900 dark:text-white" />
            <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input type={showPassword ? 'text' : 'password'} required value={registerData.confirmPassword} onChange={handleRegisterChange('confirmPassword')} placeholder={text.auth.confirmPassword} className="w-full rounded-2xl border border-cyan-500/15 bg-slate-50 py-3 pl-12 pr-4 text-slate-900 outline-none focus:border-cyan-500 dark:bg-slate-900 dark:text-white" />
          </div>
          <button disabled={isSubmitting} type="submit" className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-70">
            {text.auth.submitRegister}
          </button>
        </form>
      )}
    </BaseModal>
  );
}
