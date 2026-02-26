'use client';

import { LogOut, LayoutDashboard, User2, X } from 'lucide-react';
import Image from 'next/image';
import { useMenubar } from './useMenubar';
import Button from '@/components/ui/Button';

interface MenubarProps {
  openCount?: number;
  onCloseAll?: () => void;
}

export default function Menubar({ openCount = 0, onCloseAll }: MenubarProps) {
  const { action, state } = useMenubar();

  const { time, dropdownOpen, form, error, dropdownRef, user, router } = state;

  const { handleLogin, handleLogout, setDropdownOpen, setForm } = action;

  return (
    <div className="relative flex items-center justify-between select-none px-4 py-2 bg-[var(--menubar-bg)] text-[var(--menubar-text)]">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          <Image src="/ojantigakali-animated-round.gif" alt="ojantigakali" width={24} height={24} className="rounded-full" />
          <span className="text-xs font-bold opacity-90">Ojantigakali&apos;s Arcade</span>
        </div>
        {openCount > 0 && (
          <Button
            variant="secondary"
            size="sm"
            tactile={false}
            onClick={onCloseAll}
            iconLeft={<X size={12} />}
          >
            Close All
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div ref={dropdownRef} className="relative">
          {user ? (
            <Button
              variant="secondary"
              size="sm"
              tactile={false}
              onClick={() => setDropdownOpen((v) => !v)}
              title="Account"
              iconLeft={<User2 size={14} />}
            >
              {user.username}
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              tactile={false}
              onClick={() => setDropdownOpen((v) => !v)}
              iconLeft={<User2 size={14} />}
            >
              Login
            </Button>
          )}

          {dropdownOpen && (
            <div className="absolute top-[calc(100%+8px)] right-0 w-[220px] bg-[var(--window-bg)] border border-[var(--window-titlebar-border)] rounded-xl shadow-[0_8px_32px_var(--window-shadow)] p-4 z-[99999] flex flex-col gap-2.5">
              {user ? (
                <>
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[var(--icon-accent)] flex items-center justify-center text-sm font-extrabold text-white">
                      {user.username.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[var(--window-text)]">
                        {user.username}
                      </p>
                      <p className="text-[11px] text-[var(--window-text-muted)]">
                        Signed in
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-[var(--window-titlebar-border)]" />

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      router.push('/cms');
                    }}
                    className="flex items-center gap-2 py-2 px-2.5 rounded-lg border-none bg-transparent cursor-pointer text-[var(--window-text)] text-[13px] font-semibold w-full text-left hover:bg-[var(--window-titlebar)] transition-colors"
                  >
                    <LayoutDashboard size={13} /> Open CMS
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 py-2 px-2.5 rounded-lg border-none bg-transparent cursor-pointer text-[#ff3b30] text-[13px] font-semibold w-full text-left hover:bg-[rgba(255,59,48,0.1)] transition-colors"
                  >
                    <LogOut size={13} /> Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <p className="text-[13px] font-bold text-[var(--window-text)] mb-0.5">
                    Sign In
                  </p>
                  <div>
                    <label className="text-[10px] font-bold text-[var(--window-text-muted)] uppercase tracking-[0.06em] block mb-1">
                      Username
                    </label>
                    <input
                      autoFocus
                      autoComplete="off"
                      placeholder="username"
                      value={form.username}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, username: e.target.value }))
                      }
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                      className="w-full py-[7px] px-2.5 rounded-[7px] border border-[var(--window-titlebar-border)] bg-[var(--window-bg)] text-[var(--window-text)] text-xs outline-none font-[inherit]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[var(--window-text-muted)] uppercase tracking-[0.06em] block mb-1">
                      Password
                    </label>
                    <input
                      autoComplete="off"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, password: e.target.value }))
                      }
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                      className="w-full py-[7px] px-2.5 rounded-[7px] border border-[var(--window-titlebar-border)] bg-[var(--window-bg)] text-[var(--window-text)] text-xs outline-none font-[inherit]"
                    />
                  </div>
                  {error && (
                    <p className="text-[11px] text-[#ff3b30] -my-1">{error}</p>
                  )}

                  <div className="mt-2">
                    <Button
                      variant="accent"
                      size="sm"
                      onClick={handleLogin}
                      classNames={{ root: 'w-full mt-0.5' }}
                    >
                      Sign In →
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <span className="text-sm font-medium tabular-nums opacity-80">
          {time}
        </span>
      </div>
    </div>
  );
}
