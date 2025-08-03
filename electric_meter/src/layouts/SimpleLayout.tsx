import type { ReactNode } from "react";
import TopBarRight from "./TopBarRight";

interface SimpleLayoutProps {
	children?: ReactNode;
}

const SimpleLayout: React.FC<SimpleLayoutProps> = ({ children }) => {
	return (
		<div className="min-h-screen h-screen bg-gray-100 flex flex-col">
			{/* Top Bar */}
			<header className="bg-white shadow flex items-center px-6 py-4 flex-shrink-0">
				<h1 className="text-2xl font-bold flex-shrink-0">Gridwise</h1>
				<div className="flex-1 ml-6">
					<TopBarRight />
				</div>
			</header>

			{/* Main Content */}
			<main className="flex-1 p-6 overflow-y-auto">
				{children}
			</main>
		</div>
	);
};

export default SimpleLayout; 