import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { UserCircle } from "lucide-react";
import { acceptTeam, removeMember } from "../action";

export default function PendingMembersCard({
	teamId,
	members,
}: {
	teamId: string;
	members: any[];
}) {
	return (
		<Card className="sm:h-[400px] bg-neutral-100 overflow-y-auto">
			<CardHeader>
				<CardTitle>Requests</CardTitle>
				<CardDescription>
					<div className="mt-2">Players waiting to be accepted</div>
					<div className="border-t border-gray-300 my-4" />
				</CardDescription>
			</CardHeader>
			<CardContent>
				{members.length > 0 ? (
					members.map((member) => (
						<div key={member.id} className="flex items-center mt-4">
							<UserCircle />
							<div className="ml-4">{member.User.username}</div>
							<div className="ml-auto flex gap-2">
								<Button
									className=" bg-green-500 text-white px-4 py-2 rounded"
									onClick={() => acceptTeam(member.id)}
								>
									Accept
								</Button>
								<Button
									className=" bg-red-500 text-white px-4 py-2 rounded"
									onClick={() => removeMember(member.id)}
								>
									Decline
								</Button>
							</div>
						</div>
					))
				) : (
					<div>No pending members.</div>
				)}
			</CardContent>
		</Card>
	);
}
