import './index.css';
import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Pricing from './components/Pricing';
import Booking from './components/Booking';
import Snacks from './components/Snacks';
import Testimonials from './components/Testimonials';
import Event from './components/Event';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';

export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <About />
      <Pricing />
      <Booking />
      <Snacks />
      <Testimonials />
      <Event />
      <Gallery />
      <Contact />
      <Footer />
      <AIAssistant />
    </>
  );
}
