"use server";
import { createClient } from "@/lib/supabase/server";
import { createHash } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface TeamForm {
	teamName: string;
	postcode: number;
	sport: string;
	teamDescription: string;
}

export async function registerTeam(formData: FormData) {
	const teamData: TeamForm = {
		teamName: formData.get("teamName") as string,
		postcode: parseInt(formData.get("postcode") as string),
		sport: formData.get("sport") as string,
		teamDescription: formData.get("teamDescription") as string,
	};
	console.log(teamData);
	const supabase = createClient();
	const code = createHash("sha256")
		.update(
			teamData.teamName +
				teamData.postcode +
				teamData.sport +
				Date.now().toString()
		)
		.digest("base64")
		.substring(0, 8);
	const { data, error } = await supabase
		.from("Team")
		.insert([
			{
				name: teamData.teamName,
				postcode: teamData.postcode,
				sport: teamData.sport,
				description: teamData.teamDescription,
				id: code,
			},
		])
		.select("id");
	if (data && !error) {
		console.log(data);
		if (!error) {
			console.log(code);
			redirect("/team/" + code);
		}
	}

	return { data };
}

export async function getTeam(code: string) {
	const supabase = createClient();
	const { data: loginData, error: loginError } = await supabase.auth.getUser();
	if (loginError) {
		revalidatePath("/", "layout");
		redirect("/login");
	}
	const { data, error } = await supabase
		.from("Team")
		.select(
			`id,name, postcode, sport, User(*), description,  Member(*, User(*))`
		)
		.eq("id", code);
	if (error) {
		return { error: error.message };
	}
	if (data.length < 1) {
		return { error: "Team not found" };
	}

	const team = {
		teamName: data[0].name,
		postcode: data[0].postcode,
		sport: data[0].sport,
		teamDescription: data[0].description,
		moderator: data[0].User,
		members: data[0].Member,
	};
	return team;
}

export async function getModeratingTeams() {
	const supabase = createClient();
	const user = await supabase.auth.getUser();
	const userId = user.data.user?.id;

	if (userId) {
		const { data, error } = await supabase
			.from("Team")
			.select("id, name, sport")
			.eq("moderator", userId);

		if (error) {
			return { error: error.message };
		}
		return data;
	}
}

export async function getTeams() {
	const supabase = createClient();
	const { data: userData } = await supabase.auth.getUser();

	const { data, error } = await supabase
		.from("Member")
		.select("Team(*)")
		.eq("user_id", userData?.user?.id);

	if (error) {
		return { error: error.message };
	}
	console.log(data);
	const teams = data.map((team) => team.Team);
	return teams;
}

export async function editTeam(teamData: TeamForm, teamId: string) {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("Team")
		.update({
			name: teamData.teamName,
			postcode: teamData.postcode,
			sport: teamData.sport,
			description: teamData.teamDescription,
		})
		.eq("id", teamId);
	if (error) {
		return { error: error.message };
	}
	return { data };
}

export async function pendingMembers(
	teamId: string,
	user_id: string,
	is_member: boolean
) {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("Member")
		.update({ is_member: is_member })
		.eq("team_id", teamId)
		.eq("user_id", user_id);

	if (error) {
		return { error: error.message };
	}
	return { data };
}
export const acceptTeam = async (memberId: number) => {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("Member")
		.update({ is_member: true })
		.eq("id", memberId);
	if (error) {
		return { error: error.message };
	}
	return { data };
};

export const removeMember = async (memberId: number) => {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("Member")
		.delete()
		.eq("id", memberId);
	if (error) {
		return { error: error.message };
	}
	return { data };
};
export async function joinTeam(form: FormData) {
	const code = form.get("teamCode") as string;
	console.log(code);
	const supabase = createClient();
	const user = await supabase.auth.getUser();
	const userId = user.data.user?.id;
	console.log(userId);
	const { data: teamData, error: teamError } = await supabase
		.from("Member")
		.select("*")
		.eq("team_id", code)
		.eq("user_id", userId);
	if (teamError) {
		return { error: teamError.message };
	}
	console.log(teamData);
	if (teamData.length > 0) {
		redirect("/team/" + code);
	}
	const { data, error } = await supabase
		.from("Member")
		.insert({
			team_id: code,
			user_id: userId,
		})
		.select("*");

	if (error) {
		console.log(error);

		return { error: error.message };
	}
	console.log(data);
	return { data };
}
