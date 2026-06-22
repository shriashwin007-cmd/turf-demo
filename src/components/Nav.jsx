import { useState } from 'react';

export default function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <nav>
        <a href="#home" className="nav-logo">⚽ TURF ARENA</a>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#booking">Book Now</a></li>
          <li><a href="#snacks">Snacks</a></li>
          <li><a href="#event">Events</a></li>
          <li><a href="#gallery">Gallery</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <a href="#booking" className="nav-cta">Book a Slot</a>
        <button className="hamburger" onClick={() => setOpen(o => !o)}>
          <span /><span /><span />
        </button>
      </nav>
      <div className={`mobile-menu ${open ? 'open' : ''}`}>
        {['about','booking','snacks','event','gallery','contact'].map(id => (
          <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
            {id.charAt(0).toUpperCase() + id.slice(1)}
          </a>
        ))}
      </div>
    </>
  );
}
