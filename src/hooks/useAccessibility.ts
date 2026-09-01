import { useEffect, useRef } from 'react';

/**
 * Hook to trap focus inside a modal or drawer container
 */
export function useFocusTrap(isOpen: boolean, onClose?: () => void) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (firstElement) {
      firstElement.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (onClose) onClose();
        return;
      }

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return containerRef;
}

/**
 * Hook to announce messages to screen readers dynamically
 */
export function announceToScreenReader(message: string) {
  const announceDiv = document.createElement('div');
  announceDiv.setAttribute('aria-live', 'polite');
  announceDiv.setAttribute('aria-atomic', 'true');
  announceDiv.className = 'sr-only';
  document.body.appendChild(announceDiv);

  setTimeout(() => {
    announceDiv.textContent = message;
  }, 100);

  setTimeout(() => {
    document.body.removeChild(announceDiv);
  }, 1000);
}
