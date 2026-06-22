import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";
import Layout from "./Pages/Components/Layout";
import ProtectedRoute from "./Pages/Components/ProtectedRoute";
import Home from "./Pages/Home";
import AuthPage from "./Pages/AuthPage";
import DisplayBlogs from "./Pages/DisplayBlogs";
import BlogDetails from "./Pages/BlogDetails";
import CreateBlog from "./Pages/CreateBlog";
import EditBlog from "./Pages/EditBlog";
import Profile from "./Pages/Profile";
import NotFound from "./Pages/NotFound";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="exploreblogs" element={<DisplayBlogs />} />
            <Route path="exploreblogs/:slug" element={<BlogDetails />} />
            <Route path="create" element={<ProtectedRoute><CreateBlog /></ProtectedRoute>}/>
            <Route path="edit/:id" element={<ProtectedRoute><EditBlog /></ProtectedRoute>}/>
            <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
          </Route>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </>
  );
};

export default App;