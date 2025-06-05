
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicView from "./pages/PublicView";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Only use basename for GitHub Pages deployment
const basename = import.meta.env.PROD && window.location.hostname.includes('github.io') 
  ? "/nuzlocke-roster-view" 
  : undefined;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/" element={<PublicView />} />
          <Route path="/public" element={<PublicView />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
