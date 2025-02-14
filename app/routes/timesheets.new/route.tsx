import { useLoaderData, useActionData, redirect } from "react-router";
import { getDB } from "~/db/getDB";
import TimesheetForm from "~/components/TimesheetForm"; // Import your reusable component
import { validateTimesheet } from "controller/timesheetController";

export async function loader({ params }: any) {
  const db = await getDB();
  const employees = await db.all("SELECT id, full_name FROM employees");

  return { employees };
}

export const action = async ({ request, params }: any) => {
  const formData = await request.formData();
  const employee_id = formData.get("employee_id");
  const start_time = formData.get("start_time");
  const end_time = formData.get("end_time");
  const summary = formData.get("summary");

  const validationResult = validateTimesheet({ employee_id, start_time, end_time, summary });

  if (validationResult !== true) {
    return validationResult;
  }

  const db = await getDB();
  try {
    await db.run(
      "INSERT INTO timesheets (employee_id, start_time, end_time, summary) VALUES (?, ?, ?, ?)",
      [employee_id, start_time, end_time, summary]
    );

    return redirect("/timesheets");
  } catch (error) {
    console.error("Failed to create timesheet:", error);
    return { error: "Failed to create timesheet. Please try again." };
  }
};

export default function TimesheetPage() {
  const { employees } = useLoaderData();
  const actionData = useActionData();

  return <TimesheetForm mode='create' employees={employees} actionData={actionData} />;
}