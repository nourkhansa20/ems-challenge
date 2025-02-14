/**
 * TimesheetForm is a reusable form component for creating or updating timesheet records.
 * It supports features like:
 * - Creating new timesheets or updating existing ones.
 * - Selecting an employee from a dropdown list.
 * - Setting start and end times using datetime inputs.
 * - Adding a summary for the timesheet.
 * - Validation for all fields using the `validateTimesheet` function.
 * - Error handling and display for invalid inputs.
 * - Integration with React Router for form submission and navigation.
 * - Dynamic form behavior based on the mode (`create` or `update`).
 */

import { Form, Link } from "react-router"; // Correct import
import { useState, useEffect } from "react";
import { FormField } from "~/components/FormField";
import { validateTimesheet } from "controller/timesheetController";

interface ValidationErrors {
    employee_id?: string;
    start_time?: string;
    end_time?: string;
    summary?: string;
}

interface TimesheetFormProps {
    mode: "create" | "update";
    employees: { id: string; full_name: string }[];
    actionData?: { errors?: ValidationErrors; error?: string };
    timesheet?: any
}

export default function TimesheetForm({ employees, mode, actionData, timesheet }: TimesheetFormProps) {
    const [employeeId, setEmployeeId] = useState(timesheet?.employee_id || '');
    const [startTime, setStartTime] = useState(timesheet?.start_time || '');
    const [endTime, setEndTime] = useState(timesheet?.end_time || '');
    const [summary, setSummary] = useState(timesheet?.summary || '');
    const [errors, setErrors] = useState<ValidationErrors>({});

    useEffect(() => {
        if (actionData?.errors) {
            setErrors(actionData.errors);
        }
    }, [actionData]);

    const validateForm = () => {
        const validationResult = validateTimesheet({
            employee_id: employeeId,
            start_time: startTime,
            end_time: endTime,
            summary,
        });

        if (validationResult !== true) {
            setErrors(validationResult.errors);
            return false;
        }

        setErrors({});
        return true;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const isValid = validateForm();

        if (isValid) {
            e.currentTarget.submit();
        }
    };

    return (
        <div>
            <ul className="li-container gap-2">
                <li className="li-button"><Link to="/timesheets">All Timesheets</Link></li>
                <li className="li-button"><Link to="/employees">All Employees</Link></li>
                {timesheet && (
                    <li className="li-button">
                        <Link to={`/employees/${timesheet.employee_id}`}>Related Employee</Link>
                    </li>
                )}
            </ul>
            <Form method="post" className="form flex justify-between items-center flex-col w-[60ex]" onSubmit={handleSubmit}>
                <h1 className="page-header pb-6 w-full border border-t-0 border-l-0 border-r-0 mb-5 border-b-gray-300 ">{mode === "create" ? "Create New Timesheet" : "Edit Timesheet"}</h1>
                <div className="field-form-container !grid-cols-1">

                    <FormField
                        label="Employee"
                        type="select"
                        name="employee_id"
                        value={employeeId}
                        onChange={(selectedOption: { value: string }) => setEmployeeId(selectedOption.value)}
                        options={employees.map((emp) => ({ value: emp.id, label: emp.full_name }))}
                        error={errors.employee_id}
                    />

                    <FormField
                        label="Start Time"
                        type="datetime-local"
                        name="start_time"
                        value={startTime}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartTime(e.target.value)}
                        error={errors.start_time}
                    />

                    <FormField
                        label="End Time"
                        type="datetime-local"
                        name="end_time"
                        value={endTime}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndTime(e.target.value)}
                        error={errors.end_time}
                    />

                    <FormField
                        label="Summary"
                        type="textarea"
                        name="summary"
                        value={summary}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSummary(e.target.value)}
                        error={errors.summary}
                    />

                    {/* Display general error message */}
                    {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}

                    <button type="submit" className="primary-button mt-5">
                        {mode === "create" ? "Create Timesheet" : "Update Timesheet"}
                    </button>
                </div>
            </Form>
        </div>
    );
}