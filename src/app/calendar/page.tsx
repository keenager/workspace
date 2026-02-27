import { getSession } from "@/lib/session";
import CalendarClient from "./components/CalendarClient";
import UserStatus from "./components/UserStatus";
import { getMyEvents } from "./actions/event";
import { getUsers } from "./actions/users";
import { CalendarEvent } from "../../../generated/prisma/client";

export default async function CalendarPage() {
  const session = await getSession();
  if (!session) return <UserStatus />;
  const events: CalendarEvent[] = await getMyEvents();
  const users = await getUsers();
  // console.log("events: ", events);
  const props = { session, events, users };

  return (
    <>
      <section className="flex justify-end">
        <UserStatus />
      </section>
      <section>
        <CalendarClient {...props} />
      </section>
    </>
  );
}
