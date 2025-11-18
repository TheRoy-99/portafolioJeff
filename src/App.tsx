  import { Header } from './components/header';
  import { About } from './components/About';
  import { Work } from './components/Work';
  import { Portafolio } from './components/Portafolio';
  import { Contact } from './components/Contact';
  import { Footer } from './components/Footer';

  function App() {
    return (
      <div className="font-sans">
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