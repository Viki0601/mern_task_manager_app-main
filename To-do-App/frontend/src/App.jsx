import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ToastContainer />
      <Header />
      
      {/* Child routes render here */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
