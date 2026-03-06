import { getSession } from "@/lib/session";
import CalendarClient from "./components/calendar/CalendarClient";
import UserStatus from "./components/UserStatus";
import { getMyEvents } from "./actions/event";
import { getUsers } from "./actions/users";
import { EventFromDB } from "./types";

export default async function CalendarPage() {
  const session = await getSession();
  if (!session) return <UserStatus />;
  const events: EventFromDB[] = await getMyEvents();
  // console.log("events from db", events);
  const users = await getUsers();
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
