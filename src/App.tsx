import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { CatalogPage, GeneratorPage, SavedPage, AboutPage } from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<CatalogPage />} />
          <Route path="generator" element={<GeneratorPage />} />
          <Route path="saved" element={<SavedPage />} />
          <Route path="about" element={<AboutPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
