import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";
import Layout from "./Pages/Components/Layout";
import AuthPage from "./Pages/Auth";
import Home from "./Pages/Home";
import BlogDetails from "./Pages/BlogDetails";
import CreateBlog from "./Pages/CreateBlog";
import MyProfile from "./Pages/MyProfile";
import UpdateBlog from "./Pages/UpdateBlog";
import BlogPage from "./Pages/BlogPage";
import NotFound from "./Pages/NotFound";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/explore/:slug" element={<BlogDetails />} />
            <Route path="/create-blog" element={<CreateBlog />}/>
            <Route path="/profile" element={<MyProfile />}/>
            <Route path="/edit-blog/:blogId/:blogSlug" element={<UpdateBlog />}/>
            <Route path="/blogs" element={<BlogPage />} />
          </Route>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" />
    </>
  );
};

export default App;