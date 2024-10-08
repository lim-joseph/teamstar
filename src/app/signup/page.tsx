"use client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { signup } from "./action";
export default function LoginForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		username: "",
		firstName: "",
		lastName: "",
	});
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		setFormData((prevFormData) => ({
			...prevFormData,
			[id]: value,
		}));
	};
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsLoading(true);
		const res = await signup(formData);
		if (res.error) {
			setError(res.error);
		}
		setIsLoading(false);
	};
	return (
		<Card className="mx-auto max-w-sm">
			<CardHeader>
				<CardTitle className="text-xl">Sign Up</CardTitle>
				<CardDescription>
					Enter your information to create an account
				</CardDescription>
			</CardHeader>
			<CardContent>
				{error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4">
						<div className="grid gap-2">
							<Label htmlFor="username">Username</Label>
							<Input
								id="username"
								onChange={handleChange}
								placeholder="Max"
								required
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="m@example.com"
								required
								value={formData.email}
								onChange={handleChange}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								required
								value={formData.password}
								onChange={handleChange}
							/>
						</div>
						{isLoading ? (
							<Button type="submit" disabled>
								<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
								Creating...
							</Button>
						) : (
							<Button type="submit">Create an account</Button>
						)}
					</div>
					<div className="mt-4 text-center text-sm">
						Already have an account?{" "}
						<Link href="/login" className="underline">
							Sign in
						</Link>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
