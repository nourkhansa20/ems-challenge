/**
 * EmployeeForm is a reusable form component for creating or updating employee records.
 * It supports features like:
 * - Creating new employees or updating existing ones.
 * - File uploads for profile pictures and CVs.
 * - Validation for all fields using the `validateEmployee` function.
 * - Error handling and display for invalid inputs.
 * - Integration with React Router for form submission and navigation.
 * - Dynamic form behavior based on the mode (`create` or `update`).
 * 
 * Example Usage:
 * <EmployeeForm mode="create" /> // For creating a new employee
 * <EmployeeForm mode="update" employee={existingEmployee} /> // For updating an existing employee
 */

import { Form, Link, useActionData } from "react-router";
import { useState, useEffect } from "react";
import FileUpload from "~/components/FileUpload";
import { FormField } from "./FormField";
import { validateEmployee } from "controller/employeeController";

interface EmployeeFormProps {
    mode: "create" | "update";
    employee?: {
        full_name: string;
        email: string;
        phone_number: string;
        date_of_birth: string;
        job_title: string;
        department: string;
        salary: number;
        photo_path: string;
        cv_path: string;
    };
}

interface ValidationErrors {
    full_name?: string;
    email?: string;
    phone_number?: string;
    date_of_birth?: string;
    job_title?: string;
    department?: string;
    salary?: string;
    photo?: string;
    cv?: string;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({ mode, employee }) => {
    const [fullName, setFullName] = useState(employee?.full_name || "");
    const [email, setEmail] = useState(employee?.email || "");
    const [phoneNumber, setPhoneNumber] = useState(employee?.phone_number || "");
    const [dateOfBirth, setDateOfBirth] = useState(employee?.date_of_birth || "");
    const [jobTitle, setJobTitle] = useState(employee?.job_title || "");
    const [department, setDepartment] = useState(employee?.department || "");
    const [salary, setSalary] = useState(employee?.salary || 0);
    const [photo, setPhoto] = useState(employee?.photo_path || "");
    const [cv, setCV] = useState(employee?.cv_path || "");

    const [errors, setErrors] = useState<ValidationErrors>({});
    const actionData = useActionData() as { errors?: ValidationErrors; error?: string };

    useEffect(() => {
        if (actionData?.errors) {
            setErrors(actionData.errors);
        }
    }, [actionData]);

    const validateForm = () => {
        const validationResult = validateEmployee({
            full_name: fullName,
            email,
            phone_number: phoneNumber,
            date_of_birth: dateOfBirth,
            job_title: jobTitle,
            department,
            salary,
            cv,
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
            <ul className="li-container">
                <li className="li-button"><Link to="/employees">All Employees</Link></li>
            </ul>
            <Form method="post" encType="multipart/form-data" className="form flex justify-between items-center flex-col w-fit" onSubmit={handleSubmit}>
                <h1 className="page-header pb-6 w-full border border-t-0 border-l-0 border-r-0 mb-5 border-b-gray-300 ">{mode === "create" ? "Create New Employee" : "Update Employee"}</h1>
                <FileUpload
                    name="photo"
                    file={photo}
                    setFile={setPhoto}
                    className="size-[15ex] flex justify-center items-center mb-7"
                    placeholder="Profile Picture"
                    showFile={true}
                    error={errors.photo}
                />
                <div className="field-form-container">
                    <FormField
                        label="Full Name"
                        type="text"
                        name="full_name"
                        id="full_name"
                        value={fullName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                        error={errors.full_name}
                    />
                    <FormField
                        label="Email"
                        type="text"
                        name="email"
                        id="email"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        error={errors.email}
                    />
                    <FormField
                        label="Phone Number"
                        type="tel"
                        name="phone_number"
                        id="phone_number"
                        value={phoneNumber}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
                        error={errors.phone_number}
                    />
                    <FormField
                        label="Date of Birth"
                        type="date"
                        name="date_of_birth"
                        id="date_of_birth"
                        value={dateOfBirth}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateOfBirth(e.target.value)}
                        error={errors.date_of_birth}
                    />
                    <FormField
                        label="Job Title"
                        type="text"
                        name="job_title"
                        id="job_title"
                        value={jobTitle}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setJobTitle(e.target.value)}
                        error={errors.job_title}
                    />
                    <FormField
                        label="Department"
                        type="text"
                        name="department"
                        id="department"
                        value={department}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDepartment(e.target.value)}
                        error={errors.department}
                    />
                    <FormField
                        label="Salary"
                        type="number"
                        name="salary"
                        id="salary"
                        value={salary}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSalary(parseFloat(e.target.value))}
                        step="0.01"
                        error={errors.salary}
                    />
                </div>
                <div className="w-full mt-2">
                    <FileUpload
                        label="CV"
                        name="cv"
                        file={cv}
                        setFile={setCV}
                        className="w-full"
                        error={errors.cv}
                    />
                </div>

                {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}

                <button className="primary-button mt-6" type="submit">
                    {mode === "create" ? "Create Employee" : "Update Employee"}
                </button>
            </Form>
        </div>
    );
};