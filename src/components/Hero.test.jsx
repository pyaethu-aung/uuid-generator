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

        // Buttons
        expect(screen.getByRole('button', { name: /Generate Now/i })).toBeInTheDocument();

        const learnMoreLink = screen.getByRole('link', { name: /Learn More/i });
        expect(learnMoreLink).toBeInTheDocument();
        expect(learnMoreLink).toHaveAttribute('href', 'https://datatracker.ietf.org/doc/html/rfc4122');
        expect(learnMoreLink).toHaveAttribute('target', '_blank');
        expect(learnMoreLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders hero background container', () => {
        const { container } = render(<Hero />);
        // Check for the full-width section with relative positioning
        const section = container.querySelector('section');
        expect(section).toHaveClass('relative', 'overflow-hidden', 'hero-bg');
    });
});
