import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import BaseLayout from './components/layout/BaseLayout';
import HomePage from './pages/HomePage';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import GalleryList from './pages/GalleryList';
import GalleryDetail from './pages/GalleryDetail';
import SearchResults from './pages/SearchResults';
import ErrorPage from './pages/ErrorPage';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <BaseLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/gallery" element={<GalleryList />} />
            <Route path="/gallery/:slug" element={<GalleryDetail />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/400" element={<ErrorPage code={400} />} />
            <Route path="/403" element={<ErrorPage code={403} />} />
            <Route path="/404" element={<ErrorPage code={404} />} />
            <Route path="/500" element={<ErrorPage code={500} />} />
            <Route path="*" element={<ErrorPage code={404} />} />
          </Routes>
        </BaseLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
