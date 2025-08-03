import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Marketplace from "./pages/marketplace/marketplace";
import Admin from "./pages/admin/admin";
import Issuer from "./pages/Issuer/issuer";
import About from "./pages/about/about";
import Dashboard from "./pages/dashboard/dashboard";
import Login from "./pages/login/login";
import Header from "./components/Header";

const App = () => (
  <TooltipProvider>
    <BrowserRouter>
      <div className="relative min-h-screen">
        <div className="content">
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/issuer" element={<Issuer />} />
            <Route path="/about" element={<About />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;