import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { HeroSection } from '@/components/hero/HeroSection';

export default function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
    </MainLayout>
  );
}

