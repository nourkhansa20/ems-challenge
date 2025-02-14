// utils/validateEmployee.ts
import { validate } from "~/utils/validation";

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

export const validateEmployee = ({
    full_name,
    email,
    phone_number,
    date_of_birth,
    job_title,
    department,
    salary,
    cv,
}: {
    full_name: string;
    email: string;
    phone_number: string;
    date_of_birth: string;
    job_title: string;
    department: string;
    salary: number;
    cv: string;
}) => {
    const newErrors: ValidationErrors = {};

    newErrors.full_name = validate(full_name)
        .required("Full name is required")
        .validate();

    newErrors.email = validate(email)
        .required("Email is required")
        .email("Invalid email address")
        .validate();

    newErrors.phone_number = validate(phone_number)
        .required("Phone number is required")
        .phone("Invalid phone number")
        .validate();

    newErrors.date_of_birth = validate(date_of_birth)
        .required("Date of Birth is required")
        .date("Invalid date")
        .custom((val) => {
            const dob = new Date(val);
            const today = new Date();
            const age = today.getFullYear() - dob.getFullYear();

            // Check if the employee is at least 18 years old
            if (age < 18 || (age === 18 && today < new Date(today.setFullYear(dob.getFullYear() + 18)))) {
                return "Employee must be at least 18 years old.";
            }
            return undefined;
        })
        .validate();

    newErrors.job_title = validate(job_title)
        .required("Job title is required")
        .validate();

    newErrors.department = validate(department)
        .required("Department is required")
        .validate();

    newErrors.salary = validate(salary)
        .required("Salary is required")
        .custom((val) => {
            if (val <= 0) {
                return "Salary must be greater than 0";
            }
            return undefined;
        })
        .number()
        .validate();

    newErrors.cv = validate(cv)
        .required("CV is required")
        .validate();

    const filteredErrors = Object.fromEntries(
        Object.entries(newErrors).filter(([_, value]) => value !== undefined)
    ) as ValidationErrors;

    if (Object.keys(filteredErrors).length > 0) {
        return { errors: filteredErrors };
    }

    return true;
};