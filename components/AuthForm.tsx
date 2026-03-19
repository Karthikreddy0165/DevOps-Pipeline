'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { Mail, Lock, User, ArrowRight, Loader2, Sparkles } from 'lucide-react'

interface AuthFormProps {
  mode: 'login' | 'signup'
  onSwitch: () => void
}

export default function AuthForm({ mode, onSwitch }: AuthFormProps) {
  const { login, signup } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await signup(email, password, name || undefined)
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="glass-card-strong"
        style={{ padding: 32, maxWidth: 420, margin: '0 auto' }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'var(--gradient-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 8px 24px var(--accent-glow)',
            }}
          >
            <Sparkles size={28} color="white" />
          </motion.div>
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              color: 'var(--text-primary)',
            }}
          >
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginTop: 4 }}>
            {mode === 'login'
              ? 'Sign in to access your tasks'
              : 'Start organizing your life today'}
          </p>
        </div>

        {/* Google sign-in */}
        <button className="btn-google" type="button" onClick={() => alert('Google authentication is not yet implemented.')} style={{ marginBottom: 20 }}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32l3.57 2.77c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        <div className="divider">or</div>

        {/* Email form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mode === 'signup' && (
            <div style={{ position: 'relative' }}>
              <User
                size={16}
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-tertiary)',
                }}
              />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="input"
                style={{ paddingLeft: 40 }}
              />
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <Mail
              size={16}
              style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-tertiary)',
              }}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="input"
              style={{ paddingLeft: 40 }}
              required
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock
              size={16}
              style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-tertiary)',
              }}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="input"
              style={{ paddingLeft: 40 }}
              required
              minLength={6}
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                fontSize: '0.82rem',
                color: 'var(--danger)',
                background: 'var(--danger-light)',
                padding: '8px 14px',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginTop: 4,
            }}
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <>
                {mode === 'login' ? 'Sign In' : 'Create Account'}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p
          style={{
            textAlign: 'center',
            marginTop: 20,
            fontSize: '0.85rem',
            color: 'var(--text-tertiary)',
          }}
        >
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={onSwitch}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent)',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 'inherit',
              fontFamily: 'inherit',
            }}
          >
            {mode === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </motion.div>
  )
}
