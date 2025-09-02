"use client";
import { faker } from "@faker-js/faker";
import {
  CalendarBody,
  CalendarHeader,
  CalendarItem,
  CalendarProvider,
} from "@/components/ui/kibo-ui/calendar";
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const statuses = [
  { id: faker.string.uuid(), name: "Planned", color: "#6B7280" },
  { id: faker.string.uuid(), name: "In Progress", color: "#F59E0B" },
  { id: faker.string.uuid(), name: "Done", color: "#10B981" },
];
const exampleFeatures = Array.from({ length: 20 })
  .fill(null)
  .map(() => ({
    id: faker.string.uuid(),
    name: capitalize(faker.company.buzzPhrase()),
    startAt: faker.date.past({ years: 0.5, refDate: new Date() }),
    endAt: faker.date.future({ years: 0.5, refDate: new Date() }),
    status: faker.helpers.arrayElement(statuses),
  }));
const CalendarComponent = () => (
  <CalendarProvider>
    <CalendarHeader />
    <CalendarBody features={exampleFeatures}>
      {({ feature }) => <CalendarItem feature={feature} key={feature.id} />}
    </CalendarBody>
  </CalendarProvider>
);
export default CalendarComponent;