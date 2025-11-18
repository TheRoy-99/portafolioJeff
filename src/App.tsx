import { Header } from './components/Header';
import { About } from './components/About';
import { Work } from './components/Work';
import { Portafolio } from './components/Portafolio';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="font-['Poppins']">
      <Header />
      <About />
      <Work />
      <Portafolio />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
