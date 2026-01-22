import { DashboardProvider } from "@/context/DashboardContext";

const DashboardContent = () => {
  return <div className="bg-red-400">To Be Done Tomorrow</div>;
};

const Dashboard = () => {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
};

export default Dashboard;
