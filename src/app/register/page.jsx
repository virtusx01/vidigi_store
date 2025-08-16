'use client'

import {useState} from 'react';
import {supabase} from '@/lib/supabase/client';
import Link from 'next/link';
import { GoogleReCaptcha, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export default function RegisterPage(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setDisplayName] = useState('')
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        const {error} = await supabase.auth.signUp({
            email, password, name
        })

        if (error) {
            setError(error.message);
        } else {
            setMessage('Pendaftaran Berhasil!');
            setEmail('');
            setPassword('');
            setDisplayName('');
        }
    }

    return (
        <div>
            <h1>Register</h1>
            {error && <p style = {{color:'red'}}>{error}</p>}
            {message && <p style = {{color:'green'}}>{message}</p>}

            <form onSubmit={handleRegister}>
                <input type='name' place/>
                <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required/>
                <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
                <button type='submit'>Register</button>
            </form>

            <p>Sudah Punya Akun? <Link href='/login'>Masuk</Link></p>
        </div>
    )

}