import React from 'react';
import Particles from 'react-tsparticles';

const ParticlesBackground = () => {
  return (
    <Particles
      options={{
        background: { color: "#1e293b" },
        fpsLimit: 60,
        interactivity: {
          events: {
            onClick: { enable: true, mode: "push" },
            onHover: { enable: true, mode: "repulse" },
            resize: true,
          },
          modes: {
            push: { quantity: 4 },
            repulse: { distance: 100, duration: 0.4 },
          },
        },
        particles: {
          color: { value: "#94a3b8" },
          links: { color: "#94a3b8", distance: 150, enable: true, opacity: 0.5, width: 1 },
          collisions: { enable: true },
          move: { direction: "none", enable: true, outModes: { default: "bounce" }, random: false, speed: 1, straight: false },
          number: { density: { enable: true, area: 800 }, value: 50 },
          opacity: { value: 0.3 },
          shape: { type: "circle" },
          size: { value: { min: 1, max: 4 } },
        },
        detectRetina: true,
      }}
    />
  );
};

export default ParticlesBackground;
