import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { About } from './components/About';
import { Work } from './components/Work';
import { Portafolio } from './components/Portafolio';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { GalleryAccess } from './components/GalleryAccess';

const Home = () => (
  <>
    <Header />
    <About />
    <Work />
    <Portafolio />
    <Contact />
    <Footer />
  </>
);

function App() {
  return (
    <BrowserRouter>
      <div className="font-['Poppins']">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/galeria/:galleryId" element={<GalleryAccess />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;