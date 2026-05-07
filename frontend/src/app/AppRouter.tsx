import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import Home from '@/pages/Home/Home';
import About from '@/pages/About/About';
import Projects from '@/pages/Projects/Projects.jsx';
import Contact from '@/pages/contact/Contact';
import NotFound from '@/pages/NotFound';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<MainLayout />} >
            <Route index element={<Home />} />
            <Route path='about' element={<About />} />
            <Route path='projects' element={<Projects />} />
            <Route path='contact' element={<Contact />} />
            <Route path='*' element={<NotFound />} />
        </Route>
    )
);

const AppRouter = () => {
  return (
    <>
        <RouterProvider router={router} />
    </>
  )
}

export default AppRouter;
