import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

type AuthView = 'login' | 'register' | 'forgot' | 'verify-sent';

export default function AuthPage() {
  const { signIn, signUp, resetPassword, continueAsGuest, isConfigured } = useAuth();
  const navigate = useNavigate();

  const [view, setView] = useState<AuthView>('login');
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [success, setSuccess]   = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const validatePassword = (p: string) => p.length >= 8;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateEmail(email)) { setError('Please enter a valid email address.'); return; }
    if (!password)              { setError('Please enter your password.'); return; }
    setLoading(true);
    const { error: err } = await signIn(email, password);
    setLoading(false);
    if (err) { setError(err); return; }
    navigate('/');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim())           { setError('Please enter your name.'); return; }
    if (!validateEmail(email))  { setError('Please enter a valid email address.'); return; }
    if (!validatePassword(password)) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm)   { setError('Passwords do not match.'); return; }
    setLoading(true);
    const { error: err } = await signUp(email, password, name.trim());
    setLoading(false);
    if (err) { setError(err); return; }
    setView('verify-sent');
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateEmail(email)) { setError('Please enter a valid email address.'); return; }
    setLoading(true);
    const { error: err } = await resetPassword(email);
    setLoading(false);
    if (err) { setError(err); return; }
    setSuccess(`Password reset email sent to ${email}. Check your inbox.`);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', padding: '20px',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 12px',
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <path d="M6 18L11 12L14 15L18 8L26 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 24L11 18L14 21L18 14L26 24" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>SkillTrace AI</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Learn at your pace. Grow with every attempt.</p>
        </div>

        {/* Not configured banner */}
        {!isConfigured && (
          <div style={{
            background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.25)',
            borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13,
            color: 'var(--warning)',
          }}>
            <strong>Demo Mode:</strong> Supabase is not configured. Registration and email verification are unavailable.
            Use <strong>Continue as Guest</strong> to explore the app, or configure Supabase for full auth.
          </div>
        )}

        {/* Card */}
        <div className="card" style={{ padding: '28px 24px' }}>

          {/* ── Login ── */}
          {view === 'login' && (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: 'var(--text-primary)' }}>
                Welcome back
              </h2>
              <form onSubmit={handleLogin}>
                <Field label="Email" id="login-email" type="email" value={email}
                  onChange={setEmail} icon={<Mail size={15} />} placeholder="you@example.com" />
                <Field label="Password" id="login-password"
                  type={showPass ? 'text' : 'password'}
                  value={password} onChange={setPassword}
                  icon={<Lock size={15} />} placeholder="Your password"
                  suffix={
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  }
                />
                <div style={{ textAlign: 'right', marginBottom: 16 }}>
                  <button type="button" onClick={() => { setView('forgot'); setError(null); }}
                    style={{ fontSize: 13, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    Forgot password?
                  </button>
                </div>
                <ErrorBanner error={error} />
                <button className="btn btn-primary" style={{ width: '100%', marginBottom: 12 }}
                  type="submit" disabled={loading}>
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
              </form>
              <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)' }}>
                No account?{' '}
                <button onClick={() => { setView('register'); setError(null); }}
                  style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  Sign up
                </button>
              </p>
              <Divider />
              <button className="btn btn-ghost" style={{ width: '100%' }} onClick={continueAsGuest}>
                Continue as Guest (Demo)
              </button>
            </>
          )}

          {/* ── Register ── */}
          {view === 'register' && (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: 'var(--text-primary)' }}>
                Create account
              </h2>
              <form onSubmit={handleRegister}>
                <Field label="Your name" id="reg-name" type="text" value={name}
                  onChange={setName} icon={<User size={15} />} placeholder="Alex Johnson" />
                <Field label="Email" id="reg-email" type="email" value={email}
                  onChange={setEmail} icon={<Mail size={15} />} placeholder="you@example.com" />
                <Field label="Password" id="reg-password"
                  type={showPass ? 'text' : 'password'} value={password}
                  onChange={setPassword} icon={<Lock size={15} />} placeholder="At least 8 characters"
                  suffix={
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  }
                />
                <Field label="Confirm password" id="reg-confirm"
                  type={showPass ? 'text' : 'password'} value={confirm}
                  onChange={setConfirm} icon={<Lock size={15} />} placeholder="Repeat password" />
                <ErrorBanner error={error} />
                <button className="btn btn-primary" style={{ width: '100%', marginBottom: 12 }}
                  type="submit" disabled={loading || !isConfigured}>
                  {loading ? 'Creating account…' : 'Create Account'}
                </button>
              </form>
              <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)' }}>
                Already have an account?{' '}
                <button onClick={() => { setView('login'); setError(null); }}
                  style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  Sign in
                </button>
              </p>
              <Divider />
              <button className="btn btn-ghost" style={{ width: '100%' }} onClick={continueAsGuest}>
                Continue as Guest (Demo)
              </button>
            </>
          )}

          {/* ── Forgot password ── */}
          {view === 'forgot' && (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>
                Reset password
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
                Enter your email and we'll send a reset link.
              </p>
              {success ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <CheckCircle2 size={40} color="var(--success)" style={{ margin: '0 auto 12px', display: 'block' }} />
                  <p style={{ color: 'var(--success)', fontWeight: 600 }}>{success}</p>
                  <button className="btn btn-ghost" style={{ marginTop: 16 }} onClick={() => { setView('login'); setSuccess(null); }}>
                    Back to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgot}>
                  <Field label="Email" id="forgot-email" type="email" value={email}
                    onChange={setEmail} icon={<Mail size={15} />} placeholder="you@example.com" />
                  <ErrorBanner error={error} />
                  <button className="btn btn-primary" style={{ width: '100%', marginBottom: 12 }}
                    type="submit" disabled={loading || !isConfigured}>
                    {loading ? 'Sending…' : 'Send Reset Link'}
                  </button>
                  <button type="button" className="btn btn-ghost" style={{ width: '100%' }}
                    onClick={() => { setView('login'); setError(null); }}>
                    Back to Login
                  </button>
                </form>
              )}
            </>
          )}

          {/* ── Verify email sent ── */}
          {view === 'verify-sent' && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>
                Check your email
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
                We sent a verification link to <strong>{email}</strong>.
                Click the link in the email to verify your account, then come back to sign in.
              </p>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
                Didn't receive it? Check your spam folder, or{' '}
                <button
                  style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => setView('register')}>
                  try again
                </button>.
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }}
                onClick={() => { setView('login'); setError(null); }}>
                Back to Sign In <ArrowRight size={15} />
              </button>
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 20 }}>
          Demo mode: All progress is stored locally. No real data is shared.
        </p>
      </div>
    </div>
  );
}

// ── Sub-components ──

function Field({ label, id, type, value, onChange, icon, placeholder, suffix }: {
  label: string; id: string; type: string; value: string;
  onChange: (v: string) => void; icon: React.ReactNode;
  placeholder?: string; suffix?: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label htmlFor={id} style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>
        {label}
      </label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', left: 12, color: 'var(--text-muted)', pointerEvents: 'none', display: 'flex' }}>
          {icon}
        </div>
        <input
          id={id} type={type} value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ paddingLeft: 36, paddingRight: suffix ? 40 : 12, width: '100%' }}
          autoComplete={type === 'password' ? 'current-password' : type === 'email' ? 'email' : 'on'}
        />
        {suffix && (
          <div style={{ position: 'absolute', right: 8 }}>{suffix}</div>
        )}
      </div>
    </div>
  );
}

function ErrorBanner({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <div style={{
      display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 14,
      background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)',
      borderRadius: 8, padding: '10px 12px',
    }}>
      <AlertCircle size={15} color="var(--error)" style={{ flexShrink: 0, marginTop: 1 }} />
      <p style={{ fontSize: 13, color: 'var(--error)', margin: 0 }}>{error}</p>
    </div>
  );
}

function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>or</span>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  );
}
