"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {Button} from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {createClient} from "@/lib/supabase/client";
import {CircleUser} from "lucide-react";
import {useEffect, useState} from "react";
import {getTeam} from "../action";
import PendingMembersCard from "./PendingMembers";
export default function Dashboard({params}: {params: {dashboard: string}}) {
  const {dashboard} = params;
  const supabase = createClient();
  const [team, setTeam] = useState({
    teamName: "",
    moderator: {username: ""},
    members: [{username: "", is_member: ""}],
    teamDescription: "",
    postcode: "",
  });

  const [approvedMembers, setApprovedMembers] = useState([]);
  const [pendingMembers, setPendingMembers] = useState([]);

  async function fetchTeam() {
    const team = await getTeam(dashboard);
    console.log(team);
    setTeam(team);
    setApprovedMembers(team.members.filter((member) => member.is_member));
    setPendingMembers(team.members.filter((member) => !member.is_member));
  }

  const channels = supabase
    .channel("custom-all-channel")
    .on(
      "postgres_changes",
      {event: "*", schema: "public", table: "Member"},
      (payload) => {
        fetchTeam();
      }
    )
    .subscribe();
  useEffect(() => {
    fetchTeam();
  }, [dashboard]);

  const [inviteCode, setInviteCode] = useState("");
  const [isInviteCodeVisible, setIsInviteCodeVisible] = useState(false);
  const handleInviteClick = () => {
    // Generate an invite code (for simplicity, using a static code here)
    const code = dashboard;
    setInviteCode(code);
    setIsInviteCodeVisible(true);
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(inviteCode);
    alert("Invite code copied to clipboard!");
  };
  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold mb-4 mt-8">{"🙏" + team.teamName}</h1>
      <div className="mx-auto grid grid-cols-3 gap-2">
        {/* Left Section */}
        <Card className="w-full h-full sm:h-[820px] bg-neutral-100 overflow-y-auto">
          <CardHeader>
            <CardTitle>Upcoming Matches</CardTitle>
            <CardDescription>
              <div className="mt-2">Games to look forward to</div>
              <div className="border-t border-gray-300 my-4" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-accent">
                  <TableHead>Opponent</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div>Jeff&apos;s Dancing Club</div>
                  </TableCell>
                  <TableCell>
                    <div>Jeff&apos;s house</div>
                  </TableCell>
                  <TableCell>
                    <div>2024-08-05</div>
                  </TableCell>
                  <TableCell>
                    <div>1:00PM</div>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <div>Bball Baddies</div>
                  </TableCell>
                  <TableCell>
                    <div>Woodside Basketball Courts</div>
                  </TableCell>
                  <TableCell>
                    <div>08/08/2024</div>
                  </TableCell>
                  <TableCell>
                    <div>1:00AM</div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Match History Card Section */}
        <Card className="h-full bg-neutral-100 overflow-y-auto">
          <CardHeader>
            <CardTitle>Match History</CardTitle>
            <CardDescription>
              <div className="mt-2">Games to look back on</div>
              <div className="border-t border-gray-300 my-4" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-accent">
                  <TableHead>Opponent</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div>Monash Preschool Basketball Team</div>
                  </TableCell>
                  <TableCell>
                    <div>04/08/2023</div>
                  </TableCell>
                  <TableCell>
                    <div>11:00PM</div>
                  </TableCell>
                  <TableCell>
                    <div>L</div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="flex flex-col min-h-full">
          <div className="grid grid-rows-2 gap-2">
            {/* Top Right Section */}
            <Card className="sm:h-[400px] overflow-y-auto bg-neutral-100">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Members</CardTitle>
                  {!isInviteCodeVisible ? (
                    <Button
                      className="bg-blue-500 text-white px-4 rounded ml-4"
                      onClick={handleInviteClick}
                    >
                      Invite
                    </Button>
                  ) : (
                    <Button
                      className="bg-green-500 text-white px-4 py-2 rounded ml-4"
                      onClick={handleCopyClick}
                    >
                      {inviteCode}
                    </Button>
                  )}
                </div>
                <CardDescription>
                  Your team members
                  <div className="border-t border-gray-300 my-4" />
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center mt-4">
                  <CircleUser className="h-5 w-5" />
                  <div className="ml-4">{team.moderator.username}</div>
                </div>
                {approvedMembers &&
                  approvedMembers.map(({User}) => (
                    <div
                      className="flex items-center mt-4"
                      key={crypto.randomUUID()}
                    >
                      <CircleUser className="h-5 w-5" />
                      <div className="ml-4">{User.username}</div>
                    </div>
                  ))}
              </CardContent>
            </Card>
            <PendingMembersCard teamId={dashboard} members={pendingMembers} />

            <Card className="sm:h-[400px] overflow-y-auto bg-neutral-100">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Member suggestions</CardTitle>
                </div>
                <CardDescription>
                  Invite members with similar skills to join your team
                  temprorary or permantly
                  <div className="border-t border-gray-300 my-4" />
                </CardDescription>
                <div className="flex items-center mt-4">
                  <CircleUser className="h-5 w-5" />
                  <div className="ml-4">Bob</div>
                  <Button className="bg-green-500 text-white px-4 py-2 rounded ml-auto">
                    Invite
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
