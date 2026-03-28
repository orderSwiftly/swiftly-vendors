// src/app/auth/page.tsx
import type { Metadata } from 'next';
import AuthComp from './auth';

export const metadata: Metadata = {
    title: 'Authentication',
};

export default function AuthPage() {
    return <AuthComp />;
}