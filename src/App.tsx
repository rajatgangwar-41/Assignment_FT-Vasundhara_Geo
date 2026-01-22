import "@/App.css";
import Dashboard from "@/pages/dashboard";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="App">
      <Dashboard />
      <Toaster />
    </div>
  );
}

export default App;
