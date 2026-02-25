import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

export const useMenubar = () => {
  const [time, setTime] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, login, logout } = useAuth();

  // Clock
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Clear error when dropdown closes
  useEffect(() => {
    if (!dropdownOpen) setError('');
  }, [dropdownOpen]);

  const handleLogin = () => {
    const ok = login(form.username, form.password);
    if (!ok) {
      setError('Please fill in all fields.');
      return;
    }
    setDropdownOpen(false);
    setError('');
    router.push('/cms');
  };

  const handleLogout = () => {
    logout();
    setForm({ username: '', password: '' });
    setDropdownOpen(false);
    router.push('/');
  };

  const state = {
    time,
    dropdownOpen,
    form,
    error,
    dropdownRef,
    user,
    router,
  };

  const action = {
    setDropdownOpen,
    setForm,
    handleLogin,
    handleLogout,
  };

  return { state, action };
};
