import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    setStatus('Thank you for reaching out! We will get back to you soon.');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="contact-modern-container">
      <section className="contact-hero">
        <h1 className="contact-title">Contact Us</h1>
        <p className="contact-subtitle">We'd love to hear from you! Reach out with any questions, feedback, or partnership opportunities.</p>
      </section>
      <div className="contact-main-row">
        <section className="contact-info">
          <h2 className="contact-info-title">Our Office</h2>
          <p className="contact-info-desc">Max Collection HQ<br />123 Main Street, Karachi, Pakistan<br />Phone: +92 300 1234567<br />Email: support@maxcollection.com</p>
          <div className="contact-map-placeholder">[Map Placeholder]</div>
        </section>
        <section className="contact-form-section">
          <h2 className="contact-form-title">Send a Message</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Your Name" required className="contact-input" />
            <input name="email" value={form.email} onChange={handleChange} placeholder="Your Email" required className="contact-input" type="email" />
            <textarea name="message" value={form.message} onChange={handleChange} placeholder="Your Message" required className="contact-input" rows={5} />
            <button type="submit" className="contact-btn">Send</button>
            {status && <div className="contact-status">{status}</div>}
          </form>
        </section>
      </div>
    </div>
  );
};

export default Contact;