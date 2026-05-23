import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import {
  Home,
  About,
  Projects,
  ProjectDetail,
  Login,
  Signup,
  AdminProjects,
  AdminMessages,
  AdminLogin,
  Contact,
  NotFound,
} from "@/pages";
import AdminRouteGuard from "@/components/layout/AdminRouteGuard";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<MainLayout />} >
            <Route index element={<Home />} />
            <Route path='about' element={<About />} />
            <Route path='projects' element={<Projects />} />
            <Route path='projects/:slug' element={<ProjectDetail />} />
            <Route path='login' element={<Login />} />
            <Route path='signup' element={<Signup />} />
            <Route path='admin/login' element={<AdminLogin />} />
            <Route element={<AdminRouteGuard />}>
              <Route path='admin/projects' element={<AdminProjects />} />
              <Route path='admin/messages' element={<AdminMessages />} />
            </Route>
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
