"use client";
import { useParams } from 'next/navigation';
import Assessment from '@/components/assessment';
import { Suspense } from 'react';

// Simulated async function to fetch data (replace with actual API call)

const AssessmentContent = async ({ id }: { id: string }) => {
  return <Assessment params={{ id }} />;
};

export default function Page() {
  const params = useParams();
  const id = params?.id as string; // Type assertion since useParams returns an object with string keys

  return (
    <Suspense fallback={<div>Loading assessment...</div>}>
      <AssessmentContent id={id} />
    </Suspense>
  );
}