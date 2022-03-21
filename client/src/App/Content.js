import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Loading from '../components/Loading';
import routes from '../routes';

const PAGE_404 = lazy(() => import('../pages/Page404.js'))


// router-view
export default function Content() {
 return(<Suspense fallback={<Loading />}>
  <Routes>
    {routes.map((page, idx) => (
      <Route key={idx} {...page} />
    ))}
    <Route path='*' element={<PAGE_404 />} />
  </Routes>
</Suspense>) 
}