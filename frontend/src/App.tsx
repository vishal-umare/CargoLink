import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";


// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DriverDashboard from "./pages/driver/Dashboard";
import DriverMatches from "./pages/driver/Matches";
import DriverFindLoads from "./pages/driver/FindLoads";
import DriverTripHistory from "./pages/driver/TripHistory";
import DriverMyVehicle from "./pages/driver/MyVehicle";
import DriverProfile from "./pages/driver/Profile";
import DriverRideMap from "./pages/driver/RideMap";
import ShipperDashboard from "./pages/shipper/Dashboard";
import PostCargo from "./pages/shipper/PostCargo";
import ShipperMyLoads from "./pages/shipper/MyLoads";
import ShipperProfile from "./pages/shipper/Profile";
import ShipperLoadHistory from "./pages/shipper/LoadHistory";
import AdminDashboard from "./pages/admin/Dashboard";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Driver Routes */}
        <Route path="/driver/dashboard" element={<ProtectedRoute><DriverDashboard /></ProtectedRoute>} />
        <Route path="/driver/matches" element={<ProtectedRoute><DriverMatches /></ProtectedRoute>} />
        <Route path="/driver/find-loads" element={<ProtectedRoute><DriverFindLoads /></ProtectedRoute>} />
        <Route path="/driver/trip-history" element={<ProtectedRoute><DriverTripHistory /></ProtectedRoute>} />
        <Route path="/driver/my-vehicle" element={<ProtectedRoute><DriverMyVehicle /></ProtectedRoute>} />
        <Route path="/driver/profile" element={<ProtectedRoute><DriverProfile /></ProtectedRoute>} />
        <Route path="/driver/ride/:loadId" element={<ProtectedRoute><DriverRideMap /></ProtectedRoute>} />

        {/* Shipper Routes */}
        <Route path="/shipper/dashboard" element={<ProtectedRoute><ShipperDashboard /></ProtectedRoute>} />
        <Route path="/shipper/post-cargo" element={<ProtectedRoute><PostCargo /></ProtectedRoute>} />
        <Route path="/shipper/my-loads" element={<ProtectedRoute><ShipperMyLoads /></ProtectedRoute>} />
        <Route path="/shipper/profile" element={<ProtectedRoute><ShipperProfile /></ProtectedRoute>} />
        <Route path="/shipper/load-history" element={<ProtectedRoute><ShipperLoadHistory /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
