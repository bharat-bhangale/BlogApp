import Header from "../componenets/Header";
import Post from "../componenets/Post";
import { Routes, Route} from 'react-router-dom'
import "./App.css";
import Layout from "../componenets/Layout";
import Indexpage from "../pages/Indexpage"
import Loginpage from "../pages/Loginpage";
import Registerpage from "../pages/Registerpage";
import { UserContextProvider } from "../componenets/Usercontext";
import Createpost from "../pages/Createpost";
import Postpage from "../pages/Postpage";
import Editpage from "../pages/Editpage";

function App() {
  return (
    <>
    <UserContextProvider>
    <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Indexpage />}/>
      <Route path="/login" element={<Loginpage />} />
      <Route path="/register" element={<Registerpage />} />
      <Route path="/create" element={<Createpost />} />
      <Route path="/post/:id" element={<Postpage />} />
      <Route path="/edit/:id" element={<Editpage />} />
      </Route>
    </Routes>
    </UserContextProvider>
    </>
  );
}

export default App;
