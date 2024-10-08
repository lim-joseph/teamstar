"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function login(formData: { email: string; password: string }) {
	const supabase = createClient();

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const data = {
		email: formData.email,
		password: formData.password,
	};

	const { error } = await supabase.auth.signInWithPassword(data);

	if (error) {
		return { error: error.message };
	}

	revalidatePath("/", "layout");
	redirect("/explore");
}
