import { getSession } from "@/lib/session";
import CalendarClient from "../calendar/components/calendar/CalendarClient";
import UserStatus from "../calendar/components/UserStatus";
import { getMyEvents } from "../calendar/actions/event";
import { getUsers } from "../calendar/actions/users";
import { EventFromDB } from "../calendar/types";

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
