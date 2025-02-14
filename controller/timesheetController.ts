import { validate } from "~/utils/validation";

interface ValidationErrors {
    employee_id?: string;
    start_time?: string;
    end_time?: string;
    summary?: string;
}

export const validateTimesheet = ({ employee_id, start_time, end_time, summary }: any) => {
    const newErrors: ValidationErrors = {};

    newErrors.employee_id = validate(employee_id)
        .required("Employee is required")
        .validate();

    newErrors.start_time = validate(start_time)
        .required("Start time is required")
        .custom((val) => {
            if (new Date(val) >= new Date(end_time)) {
                return "Start time must be before end time";
            }
            return undefined;
        })
        .validate();

    newErrors.end_time = validate(end_time)
        .required("End time is required")
        .custom((val) => {
            if (new Date(val) <= new Date(start_time)) {
                return "End time must be after start time";
            }
            return undefined;
        })
        .validate();

    // // Validate Summary
    // newErrors.summary = validate(summary)
    //     .required("Summary is required")
    //     .validate();

    const filteredErrors = Object.fromEntries(
        Object.entries(newErrors).filter(([_, value]) => value !== undefined)
    ) as ValidationErrors;

    if (Object.keys(filteredErrors).length > 0) {
        return { errors: filteredErrors };
    }
    return true;
};