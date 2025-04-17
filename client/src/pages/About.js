import React from 'react';
import './About.css';

const About = () => (
  <div className="about-modern-container">
    <section className="about-hero">
      <h1 className="about-title">About Max Collection</h1>
      <p className="about-subtitle">Your destination for premium fashion, electronics, and lifestyle products.</p>
    </section>
    <section className="about-section">
      <h2 className="about-section-title">Our Story</h2>
      <p className="about-section-desc">Founded in 2022, Max Collection was born from a passion for quality and a vision to make the latest trends accessible to everyone. We started as a small team of enthusiasts and have grown into a trusted destination for thousands of customers across Pakistan and beyond.</p>
    </section>
    <section className="about-section">
      <h2 className="about-section-title">Our Mission</h2>
      <p className="about-section-desc">To empower our customers with the best selection of products, seamless shopping experience, and exceptional customer service. We believe in making shopping enjoyable, affordable, and reliable.</p>
    </section>
    <section className="about-section">
      <h2 className="about-section-title">Our Values</h2>
      <ul className="about-values-list">
        <li>Customer First: We put our customers at the heart of everything we do.</li>
        <li>Quality: We curate only the best products from trusted brands.</li>
        <li>Innovation: We embrace technology to improve your shopping experience.</li>
        <li>Integrity: We are transparent, honest, and ethical in all our dealings.</li>
      </ul>
    </section>
    <section className="about-section about-section-team">
      <h2 className="about-section-title">Meet Our Team</h2>
      <div className="about-team-grid">
        <div className="about-team-member">
          <img src="/logo192.png" alt="Team Member" className="about-team-img" />
          <div className="about-team-name">Nazeer</div>
          <div className="about-team-role">Founder & CEO</div>
        </div>
        <div className="about-team-member">
          <img src="/logo192.png" alt="Team Member" className="about-team-img" />
          <div className="about-team-name"></div>
          <div className="about-team-role">Head of Operations</div>
        </div>
        <div className="about-team-member">
          <img src="/logo192.png" alt="Team Member" className="about-team-img" />
          <div className="about-team-name"></div>
          <div className="about-team-role">Lead Developer</div>
        </div>
      </div>
    </section>
    <section className="about-section">
      <h2 className="about-section-title">Admin Panel</h2>
      <p className="about-section-desc">
        The admin panel is available at <a href="/admin" style={{ color: '#1565c0', textDecoration: 'underline' }}>https://yourdomain.com/admin</a>.<br/>
        After deployment, only authorized admins can log in. For enhanced security, we recommend using email and password authentication for admin access.
      </p>
    </section>
  </div>
);

export default About;