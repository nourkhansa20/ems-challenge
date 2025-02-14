import { Link, useLoaderData } from "react-router";
import { useState } from "react";
import { useNavigate } from "react-router";
import { getDB } from "~/db/getDB";
import TableComponent from "~/components/TableComponent";
import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import {
  createCalendar,
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
import "@schedule-x/theme-default/dist/index.css";
import { format } from "date-fns";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import { FormField } from "~/components/FormField";

export async function loader() {
  const db = await getDB();
  const timesheetsAndEmployees = await db.all(
    "SELECT timesheets.*, employees.full_name, employees.id AS employee_id FROM timesheets JOIN employees ON timesheets.employee_id = employees.id"
  );

  return { timesheetsAndEmployees };
}

export default function TimesheetsPage() {
  const { timesheetsAndEmployees } = useLoaderData() as {
    timesheetsAndEmployees: {
      id: string;
      employee_id: string;
      full_name: string;
      start_time: string;
      end_time: string;
      summary: string;
    }[];
  };

  const [view, setView] = useState<"table" | "calendar">("table");
  const [selectedEmployee, setSelectedEmployee] = useState<string | "all">("all");
  const navigate = useNavigate();
  const eventsService = useState(() => createEventsServicePlugin())[0];

  const headers = ["full_name", "start_time", "end_time", "summary"];

  const employees = Array.from(
    new Set(
      timesheetsAndEmployees.map(ts => ({ label: ts.full_name, value: ts.full_name }))
    )
  );
  const filteredTimesheets = timesheetsAndEmployees.filter(ts => {
    const matchesEmployee = selectedEmployee === "all" || ts.full_name === selectedEmployee;
    return matchesEmployee;
  });

  const calendarEvents = filteredTimesheets.map(timesheet => ({
    id: timesheet.id,
    title: timesheet.full_name,
    start: format(timesheet.start_time, "yyyy-MM-dd HH:mm"),
    end: format(timesheet.end_time, "yyyy-MM-dd HH:mm"),
  }));


  const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    events: calendarEvents,
    plugins: [eventsService],
  });

  return (
    <div className="w-full">
      <div className="mb-4 clas flex justify-between">
        <div className="flex gap-3 w-fit items-center">
          <button
            onClick={() => setView("table")}
            className={`p-2 h-fit cursor-pointer w-[20ex] border rounded-md transition-colors duration-300 ${view === "table" ? "bg-black text-white" : "text-black border border-gray-300"
              }`}
          >
            Table View
          </button>
          <button
            onClick={() => setView("calendar")}
            className={`p-2 h-fit cursor-pointer w-[20ex] border rounded-md transition-colors duration-300 ${view === "calendar" ? "bg-black text-white" : "text-black border border-gray-300"
              }`}
          >
            Calendar View
          </button>
        </div>
        <ul className="li-container">
          <li className="li-button">
            <Link to="/employees">Employees</Link>
          </li>
        </ul>
      </div>

      {view === "table" ? (
        <TableComponent
          filterFields={() => (
            <FormField
              name="employee"
              id="employee"
              type="select"
              options={[
                { value: "all", label: "All Employees" }, // Add "All Employees" option
                ...employees, // Spread the existing employees array
              ]}
              value={selectedEmployee}
              onChange={(e: any) => setSelectedEmployee(e.value)}
            />
          )}
          renderColumn={({ column, value, row }) => {
            if (column === "start_time" || column === "end_time") {
              return format(new Date(value), "yyyy-MM-dd HH:mm"); // Format the date
            }
            return value; // Return the original value for other columns
          }}
          name="timesheet"
          data={filteredTimesheets}
          headers={headers}
          rowsPerPage={5}
          onRowClick={(row) => navigate(`/timesheets/${row.id}`)}
        />
      ) : (
        <div className="calendar-container w-full">
          <ScheduleXCalendar calendarApp={calendar} />
        </div>
      )}
    </div>
  );
}