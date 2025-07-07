import { createFileRoute } from "@tanstack/react-router";
import SimpleLayout from "@/layouts/SimpleLayout";
import Algorithms from "@/features/algorithms/components/Algorithms";

export const Route = createFileRoute("/algorithms")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<SimpleLayout>
			<Algorithms />
		</SimpleLayout>
	);
}
