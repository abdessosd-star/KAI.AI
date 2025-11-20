
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Landing } from '../components/Landing';
import { describe, it, expect, vi } from 'vitest';

// Mock translations since we don't have the full context or want to test the actual translations file here
vi.mock('../constants/translations', () => ({
  translations: {
    en: {
      landing: {
        heroTitle: 'Future-Proof Your Career',
        heroSubtitle: 'Discover how AI will impact your role.',
        cta: 'Start Assessment',
        kaiTitle: 'The KAI Model',
        kaiSubtitle: 'Understanding Automation, Augmentation, and Human-Centric skills.',
        cards: {
            automate: { title: 'Automate', desc: 'Tasks for machines', tags: ['Repetitive'] },
            augment: { title: 'Augment', desc: 'Humans + AI', tags: ['Creative'] },
            human: { title: 'Human', desc: 'Human only', tags: ['Empathy'] }
        },
        features: {
            step1: { title: 'Define', desc: 'Scope your role' },
            step2: { title: 'Assess', desc: 'Analyze tasks' },
            step3: { title: 'Strategize', desc: 'Build a plan' }
        }
      }
    },
    nl: {
      landing: {
        heroTitle: 'Toekomstbestendig je carrière',
        heroSubtitle: 'Ontdek hoe AI jouw rol zal beïnvloeden.',
        cta: 'Start Assessment',
        kaiTitle: 'Het KAI Model',
        kaiSubtitle: 'Begrijp Automatisering, Augmentatie en Menselijke vaardigheden.',
        cards: {
            automate: { title: 'Automatiseren', desc: 'Taken voor machines', tags: ['Repetitief'] },
            augment: { title: 'Augmenteren', desc: 'Mens + AI', tags: ['Creatief'] },
            human: { title: 'Menselijk', desc: 'Alleen mens', tags: ['Empathie'] }
        },
        features: {
            step1: { title: 'Definieer', desc: 'Bepaal je rol' },
            step2: { title: 'Beoordeel', desc: 'Analyseer taken' },
            step3: { title: 'Strategie', desc: 'Maak een plan' }
        }
      }
    }
  }
}));

describe('Landing Component', () => {
  it('renders correctly in English', () => {
    const onStart = vi.fn();
    render(<Landing onStart={onStart} language="en" />);

    expect(screen.getByText('Future-Proof Your Career')).toBeInTheDocument();
    expect(screen.getByText('Discover how AI will impact your role.')).toBeInTheDocument();
    expect(screen.getByText('Start Assessment')).toBeInTheDocument();
    expect(screen.getByText('Automate')).toBeInTheDocument();
    expect(screen.getByText('Augment')).toBeInTheDocument();
    expect(screen.getByText('Human')).toBeInTheDocument();
  });

  it('renders correctly in Dutch', () => {
    const onStart = vi.fn();
    render(<Landing onStart={onStart} language="nl" />);

    expect(screen.getByText('Toekomstbestendig je carrière')).toBeInTheDocument();
    expect(screen.getByText('Ontdek hoe AI jouw rol zal beïnvloeden.')).toBeInTheDocument();
  });

  it('calls onStart when the start button is clicked', () => {
    const onStart = vi.fn();
    render(<Landing onStart={onStart} language="en" />);

    const button = screen.getByText('Start Assessment');
    fireEvent.click(button);

    expect(onStart).toHaveBeenCalledTimes(1);
  });
});
