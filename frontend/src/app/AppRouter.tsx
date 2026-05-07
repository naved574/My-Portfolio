import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import {
    Home,
    About,
    Projects,
    Contact,
    NotFound,
} from '@/pages';
import MainLayout from '@/layouts/MainLayout';

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
