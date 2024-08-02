import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	CircleUser,
	Home,
	LineChart,
	Package,
	Package2,
	Users,
} from "lucide-react";
import { Inter as FontSans } from "next/font/google";
import Link from "next/link";
import "./globals.css";

import { ModeToggle } from "@/components/ModeToggle";
import { ThemeProvider } from "@/components/theme-provider";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "./logout/action";

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

export const metadata = {
	title: "teamStar",
	description: "Find local scrims",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body
				className={cn(
					"min-h-screen bg-background font-sans antialiased flex",
					fontSans.variable
				)}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<div className="grid min-h-svh w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
						<aside className="hidden border-r bg-muted/40 md:block">
							<nav className="flex h-full max-h-screen flex-col gap-2">
								<div className="flex justify-between h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
									<Link
										href="/"
										className="flex items-center gap-2 font-semibold"
									>
										<Package2 className="h-6 w-6" />
										<span className="">teamStar</span>
									</Link>
									<ModeToggle />
								</div>
								<div className="flex-1">
									<nav className="grid items-start px-2 text-sm font-medium lg:px-4">
										<Link
											href="/explore"
											className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-primary bg-muted transition-all hover:text-primary"
										>
											<Home className="h-4 w-4" />
											Explore
										</Link>
										<Link
											href="#"
											className="flex items-center gap-3 rounded-lg  px-3 py-2 text-muted-foreground transition-all hover:text-primary"
										>
											<Package className="h-4 w-4" />
											Team
										</Link>
										<Link
											href="#"
											className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
										>
											<Users className="h-4 w-4" />
											History
										</Link>
										<Link
											href="#"
											className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
										>
											<LineChart className="h-4 w-4" />
											Analytics
										</Link>
									</nav>
								</div>
								<div className="flex flex-col gap-4">
									<div className="flex flex-col px-4 text-sm font-medium lg:px-4">
										<Link
											href="#"
											className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
										>
											<LineChart className="h-4 w-4" />
											Support
										</Link>
										<Link
											href="#"
											className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
										>
											<LineChart className="h-4 w-4" />
											Settings
										</Link>
									</div>
									<div className="mt-auto p-4 gap-4 flex flex-col border-t">
										<div className="flex gap-4">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="ghost"
														className="flex gap-4 w-full justify-start text-left"
													>
														<CircleUser className="h-5 w-5" />
														<div className="text-sm">
															<p className="font-bold">Joseph</p>
															<p className="text-muted-foreground">
																joseph@example.com
															</p>
														</div>
														<span className="sr-only">Toggle user menu</span>
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuItem>
														<form action={logout} method="post">
															<button type="submit">Logout</button>
														</form>
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									</div>
								</div>
							</nav>
						</aside>
						<div className="flex flex-col">
							<main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
								<div
									className=" rounded-lg border border-dashed shadow-sm"
									x-chunk="dashboard-02-chunk-1"
								>
									<div className="flex flex-col gap-1 p-8 min-h-full">
										{children}
									</div>
								</div>
							</main>
						</div>
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
