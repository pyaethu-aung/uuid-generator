import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Hero from './Hero';

describe('Hero Component', () => {
    it('renders key hero elements', () => {
        render(<Hero />);

        // Badge
        expect(screen.getByText(/FRESH IDS/i)).toBeInTheDocument();

        // Headline
        expect(screen.getByText(/Generate UUIDs Instantly/i)).toBeInTheDocument();

        // Sub-headline (check for partial text)
        expect(screen.getByText(/Fast, secure, and verifiable/i)).toBeInTheDocument();



        const learnMoreLink = screen.getByRole('link', { name: /Learn More/i });
        expect(learnMoreLink).toBeInTheDocument();
        expect(learnMoreLink).toHaveAttribute('href', 'https://datatracker.ietf.org/doc/html/rfc4122');
        expect(learnMoreLink).toHaveAttribute('target', '_blank');
        expect(learnMoreLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders hero background container', () => {
        render(<Hero />);
        // Check for the full-width section with relative positioning
        const section = screen.getByLabelText('Hero');
        expect(section).toHaveClass('relative', 'overflow-hidden', 'hero-bg');
    });

    it('uses theme-aware classes', () => {
        render(<Hero />);

        // Check for theme classes on key elements
        const badge = screen.getByText(/FRESH IDS/i);
        expect(badge).toHaveClass('theme-badge');

        const h1 = screen.getByRole('heading', { level: 1 });
        expect(h1).toHaveClass('theme-text-primary');


        const learnMoreLink = screen.getByRole('link', { name: /Learn More/i });
        expect(learnMoreLink).toHaveClass('theme-ghost-button');
    });
});
