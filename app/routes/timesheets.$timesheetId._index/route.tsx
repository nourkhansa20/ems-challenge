import { validateTimesheet } from "controller/timesheetController";
import { useLoaderData, redirect } from "react-router";
import TimesheetForm from "~/components/TimesheetForm"; // Adjust the import path as needed
import { getDB } from "~/db/getDB";

export async function loader({ params }: any) {
  const db = await getDB();
  const employees = await db.all("SELECT id, full_name FROM employees;");
  const timesheet = params.timesheetId
    ? await db.get("SELECT * FROM timesheets WHERE id = ?", [params.timesheetId])
    : null;

  return { employees, timesheet };
}

export async function action({ request, params }: any) {
  const formData = await request.formData();
  const db = await getDB();

  const employee_id = formData.get("employee_id") as string;
  const start_time = formData.get("start_time") as string;
  const end_time = formData.get("end_time") as string;
  const summary = formData.get("summary") as string;

  const validationResult = validateTimesheet({
    employee_id,
    start_time,
    end_time,
    summary,
  });

  if (validationResult !== true) {
    return validationResult;
  }

  await db.run(
    `UPDATE timesheets SET
      employee_id = ?, start_time = ?, end_time = ?, summary = ?
    WHERE id = ?`,
    [employee_id, start_time, end_time, summary, params.timesheetId]
  );

  return redirect("/timesheets");
}

export default function TimesheetPage() {
  const { employees, timesheet } = useLoaderData() as {
    employees: { id: string; full_name: string }[];
    timesheet?: {
      id: string;
      employee_id: string;
      start_time: string;
      end_time: string;
      summary: string;
    };
  };

  return (
    <div>
      <TimesheetForm
        mode='update'
        timesheet={timesheet}
        employees={employees}
      />
    </div>
  );
}