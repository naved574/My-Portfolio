import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import {
  Home,
  About,
  Projects,
  ProjectDetail,
  AdminProjects,
  AdminLogin,
  Contact,
  NotFound,
} from "@/pages";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<MainLayout />} >
            <Route index element={<Home />} />
            <Route path='about' element={<About />} />
            <Route path='projects' element={<Projects />} />
            <Route path='projects/:slug' element={<ProjectDetail />} />
            <Route path='admin/login' element={<AdminLogin />} />
            <Route path='admin/projects' element={<AdminProjects />} />
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
