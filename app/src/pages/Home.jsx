import React from "react";

// home page
export default function Home() {
  return (
    <main>
      <Hero />
    </main>
  );
}

// hero content
const Hero = () => (
  <section className="hero">
    <div className="hero__content">
      <h1 className="hero__title">Volcanoes of Earth</h1>
      <p className="hero__subtitle">A comprehensive encyclopedia of the volcanoes on our planet</p>
    </div>
  </section>
);
