'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export default function TourProvider({ steps, tourConfig = {}, onFinish }) {
  const router = useRouter();
  const pathname = usePathname();
  const finalStepActive = useRef(false);
  const tourRef = useRef(null);
  const userSkipped = useRef(false);
  const isUnmounting = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const tourDone = localStorage.getItem('dashboardTourCompleted') === 'true';
    if (tourDone) return;

    isUnmounting.current = false;
    userSkipped.current = false;
    finalStepActive.current = false;

    const handleStepNavigation = (idx) => {
      const step = steps[idx];
      if (!step) return;
      if (step.localStorageKey) {
        localStorage.setItem(
          step.localStorageKey,
          step.localStorageValue || 'true'
        );
      }
      if (step.currentStepTourFinishKey) {
        localStorage.removeItem(step.currentStepTourFinishKey);
      }
      step.onNavigate?.();
      if (step.nextPage) {
        setTimeout(() => router.push(step.nextPage), 100);
      }
    };

    const defaultConfig = {
      steps,
      showProgress: true,
      allowClose: true,
      overlayClickBehavior: 'close',
      showButtons: ['previous', 'next'],

      onPopoverRender: (popover) => {
        const skipBtn = document.createElement('button');
        skipBtn.innerText = 'Skip Tour';
        skipBtn.className = 'driver-btn driver-btn-skip';
        skipBtn.addEventListener('click', () => {
          userSkipped.current = true;
          tourRef.current?.destroy();
          localStorage.setItem('dashboardTourCompleted', 'true');
        });
        const nextBtn = popover.footerButtons.querySelector('.driver-next-btn');
        if (nextBtn) popover.footerButtons.insertBefore(skipBtn, nextBtn);
        else popover.footerButtons.appendChild(skipBtn);
      },

      onNext: (_el, _step, nextIdx) => {
        const prevIdx = nextIdx - 1;
        const prev = steps[prevIdx];
        if (prev?.isFinalStep) {
          localStorage.setItem('dashboardTourCompleted', 'true');
          finalStepActive.current = true;
          onFinish?.();
        }
        if (prev?.nextPage) {
          tourRef.current?.destroy();
          handleStepNavigation(prevIdx);
        }
      },

      onDestroyed: () => {
        if (userSkipped.current || isUnmounting.current) return;

        const lastIdx = steps.length - 1;
        const last = steps[lastIdx];
        handleStepNavigation(lastIdx);

        if (finalStepActive.current || last?.isFinalStep) {
          localStorage.setItem('dashboardTourCompleted', 'true');
          onFinish?.();
          if (last.nextPage) {
            router.push(last.nextPage);
          }
        }
      },

      ...tourConfig,
    };

    const blockOverlayClicks = (e) => {
      if (e.target.closest('.driver-overlay')) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    };
    document.addEventListener('click', blockOverlayClicks, true);

    let attempts = 0;
    const startTour = () => {
      try {
        tourRef.current = driver(defaultConfig);
        tourRef.current.drive();
      } catch (err) {
        if (attempts < 5) {
          attempts += 1;
          setTimeout(startTour, 200);
        } else {
          console.error('Failed to start tour after retries:', err);
        }
      }
    };

    const startupTimer = setTimeout(startTour, 100);

    return () => {
      isUnmounting.current = true;
      tourRef.current?.destroy();
      document.removeEventListener('click', blockOverlayClicks, true);
      clearTimeout(startupTimer);
    };
  }, [pathname, steps, router, tourConfig, onFinish]);

  return null;
}
