import { ReactNode } from "react";

interface DashboardLayoutProps {
  palette: ReactNode;
  meterSection: ReactNode;
  graphSection: ReactNode;
  topBarRight?: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  palette,
  meterSection,
  graphSection,
  topBarRight,
}) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Bar */}
      <header className="bg-white shadow flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold">Energy Simulator</h1>
        <div className="flex items-center space-x-4">{topBarRight}</div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar / Tool Palette */}
        <aside className="w-64 bg-white overflow-y-auto">
          {palette}
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Energy Meter Section */}
          <section className="bg-white rounded-lg shadow">
            {meterSection}
          </section>

          {/* Consumption Graph Section */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Consumption Graph</h2>
            {graphSection}
          </section>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
