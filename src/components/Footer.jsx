export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div>
          <div className="footer-logo">⚽ TURF ARENA</div>
          <p className="footer-desc">
            Chennai's premier multi-sport facility. FIFA-standard grass, professional floodlights,
            and world-class amenities for every level of player.
          </p>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#about">About Us</a></li>
            <li><a href="#booking">Book a Slot</a></li>
            <li><a href="#snacks">Snacks & Beverages</a></li>
            <li><a href="#event">Events</a></li>
            <li><a href="#gallery">Gallery</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <ul>
            <li><a href="#">+91 93456 78901</a></li>
            <li><a href="#">info@turfarena.in</a></li>
            <li><a href="#">www.turfarena.in</a></li>
            <li><a href="#">Mogappair East, Chennai</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span className="footer-copy">© 2026 TURF Arena. All rights reserved.</span>
        <span className="footer-copy">Made with ❤️ for Chennai's sporting community</span>
      </div>
    </footer>
  );
}
