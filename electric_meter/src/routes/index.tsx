import ElectricMeter from "@/features/electric-meter/components/ElectricMeter";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useInitApp, initApp } from "@/hooks/useInitApp";
import DashboardLayout from "@/layouts/DashboardLayout";
import TopBarRight from "@/layouts/TopBarRight";
import { createFileRoute } from "@tanstack/react-router";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { DevicePalette } from "@/features/device-palette/components/DevicePalette";

const Palette = () => {
  return <DevicePalette onAddDevice={() => {}} />;
};

const MeterSection = () => {
  return (
    <ElectricMeter
      onRemoveDevice={() => {
        console.log("remove device");
      }}
    />
  );
};

const GraphSection = () => {
  return <div>Graph Section</div>;
};



const MainRootComponent = () => {
  useInitApp();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const backend = isMobile ? TouchBackend : HTML5Backend;

  return (
    <DndProvider backend={backend}>
      <DashboardLayout
        palette={<Palette />}
        meterSection={<MeterSection />}
        graphSection={<GraphSection />}
        topBarRight={<TopBarRight />}
      />
    </DndProvider>
  );
};

export const Route = createFileRoute("/")({
  component: MainRootComponent,
  beforeLoad: () => initApp(),
});
