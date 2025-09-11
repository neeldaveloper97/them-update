'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

export default function BuiltAroundYou() {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  const features = [
    {
      id: 1,
      title: 'Knows your developmental mindset',
      description: 'Adapts to your unique perspective and growth stage',
    },
    {
      id: 2,
      title: 'Tracks emotional and cognitive shifts',
      description: 'Monitors your progress and evolves with you',
    },
    {
      id: 3,
      title: 'Learns from 1 million+ simulated growth journeys',
      description: 'Leverages collective intelligence to guide your path',
    },
  ];

  return (
    <section ref={ref} className="py-24 overflow-hidden bg-white md:py-32">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col items-center gap-12 md:flex-row">
          {/* Adaptive Agent Swarm Visualization */}
          <motion.div
            className="relative md:w-1/2"
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } },
            }}
          >
            <div className="relative max-w-md mx-auto aspect-square size-96 md:size-auto">
              {/* Central user circle */}
              <div className="absolute z-10 flex items-center justify-center w-24 h-24 -translate-x-1/2 -translate-y-1/2 bg-gray-100 rounded-full top-1/2 left-1/2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>

              {/* Orbital rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-gray-200 animate-[spin_20s_linear_infinite]"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-gray-200 animate-[spin_30s_linear_infinite_reverse]"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-gray-200 animate-[spin_40s_linear_infinite]"></div>

              {/* Agent dots */}
              <div className="absolute w-48 h-48 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary-light-500 rounded-full animate-[ping_2s_ease-in-out_infinite]"></div>
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-4 h-4 bg-purple-500 rounded-full animate-[ping_3s_ease-in-out_infinite]"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-green-500 rounded-full animate-[ping_2.5s_ease-in-out_infinite]"></div>
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-4 h-4 bg-amber-500 rounded-full animate-[ping_1.8s_ease-in-out_infinite]"></div>
              </div>

              <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-72 h-72">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-cyan-500 rounded-full animate-[ping_2.2s_ease-in-out_infinite]"></div>
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full animate-[ping_3.2s_ease-in-out_infinite]"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-indigo-500 rounded-full animate-[ping_2.7s_ease-in-out_infinite]"></div>
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-3 h-3 bg-pink-500 rounded-full animate-[ping_1.9s_ease-in-out_infinite]"></div>
              </div>

              <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-96 h-96">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-emerald-500 rounded-full animate-[ping_2.4s_ease-in-out_infinite]"></div>
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-2 bg-violet-500 rounded-full animate-[ping_3.4s_ease-in-out_infinite]"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-yellow-500 rounded-full animate-[ping_2.9s_ease-in-out_infinite]"></div>
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-2 bg-rose-500 rounded-full animate-[ping_2.1s_ease-in-out_infinite]"></div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <div className="relative z-30 bg-white md:w-1/2">
            <motion.h2
              className="mb-4 text-3xl font-semibold md:text-4xl"
              initial="hidden"
              animate={controls}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
            >
              Built Around You
            </motion.h2>

            <motion.p
              className="mb-12 text-xl text-gray-600"
              initial="hidden"
              animate={controls}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, delay: 0.2 },
                },
              }}
            >
              Our agents don't just answer. They understand your growth edge.
            </motion.p>

            <div className="space-y-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  className="flex items-start gap-4"
                  initial="hidden"
                  animate={controls}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.5,
                        delay: 0.3 + index * 0.2,
                      },
                    },
                  }}
                >
                  <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 mt-1 bg-black rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
