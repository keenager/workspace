import { getSession } from "@/lib/session";
import CalendarProvider from "./CalendarProvider";
import CalendarClient from "./components/CalendarClient";
import UserStatus from "./components/UserStatus";
import { Schedule } from "./types";
import { getMyEvents } from "./actions/event";
import { getUsers } from "./actions/users";

export default async function CalendarPage() {
  const session = await getSession();
  if (!session) return undefined;
  const events = await getMyEvents();
  const users = await getUsers();
  console.log("events: ", events);
  const props = { session, events, users };

  return (
    <CalendarProvider>
      <section className="flex justify-end">
        <UserStatus />
      </section>
      <section>
        <CalendarClient {...props} />
      </section>
    </CalendarProvider>
  );
}
