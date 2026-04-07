import ProcessDashboard from '@/components/process-sales/dashboard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Process Sale",
};

export default function ProcessSalePage() {
    return (
        <main className='flex flex-col items-start w-full justify-center mb-20'>
            <ProcessDashboard />
        </main>
    )
}