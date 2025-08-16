// app/login/page.js
'use client'

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available');
      return;
    }

    setIsVerifying(true);
    const token = await executeRecaptcha('login');

    const res = await fetch('/api/verify-captcha', {
      method: 'POST',
      body: JSON.stringify({ token }),
      headers: { 'Content-Type': 'application/json' },
    });
    
    const captchaData = await res.json();
    setIsVerifying(false);

    if (!captchaData.success) {
      setError('Verifikasi Captcha gagal. Silakan coba lagi.');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSignIn}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={isVerifying}>
          {isVerifying ? 'Verifikasi...' : 'Login'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>Belum punya akun? <Link href="/register">Daftar di sini yaaa</Link></p>
    </div>
  );
}

// Bungkus komponen utama dengan provider reCAPTCHA
export default function LoginPage() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
      <LoginForm />
    </GoogleReCaptchaProvider>
  );
}