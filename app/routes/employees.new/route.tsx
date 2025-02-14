import { redirect, type ActionFunction } from "react-router";
import { getDB } from "~/db/getDB";
import fs from "fs";
import path from "path";
import { validateEmployee } from "controller/employeeController";
import { EmployeeForm } from "~/components/EmployeeForm";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const full_name = formData.get("full_name") as string;
  const email = formData.get("email") as string;
  const phone_number = formData.get("phone_number") as string;
  const date_of_birth = formData.get("date_of_birth") as string;
  const job_title = formData.get("job_title") as string;
  const department = formData.get("department") as string;
  const salary = parseFloat(formData.get("salary") as string);
  const photo = formData.get("photo") as File;
  const cv = formData.get("cv") as File;

  const validationResult = validateEmployee({
    full_name,
    email,
    phone_number,
    date_of_birth,
    job_title,
    department,
    salary,
    cv: cv.name,
  });

  if (validationResult !== true) {
    return validationResult; 
  }

  const dob = new Date(date_of_birth);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();

  const db = await getDB();

  try {
    const result = await db.run(
      `INSERT INTO employees (
        full_name, email, phone_number, date_of_birth, job_title, department, salary
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [full_name, email, phone_number, date_of_birth, job_title, department, salary]
    );

    const employeeId = result.lastID;

    const employeeDir = path.join(process.cwd(), "public", "uploads", `employee_${employeeId}`);
    if (!fs.existsSync(employeeDir)) {
      fs.mkdirSync(employeeDir, { recursive: true });
    }

    const photoPath = path.join(employeeDir, "photo.png");
    const cvPath = path.join(employeeDir, "cv.pdf");

    await fs.promises.writeFile(photoPath, Buffer.from(await photo.arrayBuffer()));
    await fs.promises.writeFile(cvPath, Buffer.from(await cv.arrayBuffer()));

    // Relative paths for frontend access
    const relativePhotoPath = `/uploads/employee_${employeeId}/photo.png`;
    const relativeCvPath = `/uploads/employee_${employeeId}/cv.pdf`;

    await db.run(
      `UPDATE employees SET
        photo_path = ?, cv_path = ?
      WHERE id = ?`,
      [relativePhotoPath, relativeCvPath, employeeId]
    );

    return redirect("/employees");
  } catch (error) {
    console.error("Failed to create employee:", error);
    return { error: "Failed to create employee. Please try again." };
  }
};

export default function NewEmployeePage() {
  return <EmployeeForm mode="create" />;
}
