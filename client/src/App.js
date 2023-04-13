import { BrowserRouter, Routes, Route } from "react-router-dom";

import {
  Landing,
  Register,
  NotFound,
  ProtectedRoute,
  UnprotectedRoute,
} from "./pages";
import {
  AddJob,
  AllJobs,
  Profile,
  SharedLayout,
  Stats,
} from "./pages/dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SharedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Stats />} />
          <Route path="all-jobs" element={<AllJobs />} />
          <Route path="add-job" element={<AddJob />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route
          path="/register"
          element={
            <UnprotectedRoute>
              <Register />
            </UnprotectedRoute>
          }
        />
        <Route
          path="/landing"
          element={
            <UnprotectedRoute>
              <Landing />
            </UnprotectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
