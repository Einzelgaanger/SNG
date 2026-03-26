// This file now redirects to the dashboard layout.
// Kept for backwards compatibility if any links point to /app directly.
import { Navigate } from "react-router-dom";

const Index = () => <Navigate to="/app" replace />;
export default Index;
