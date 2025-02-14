import { redirect, type ActionFunction, useLoaderData, Link } from "react-router";
import { getDB } from "~/db/getDB";
import fs from "fs";
import path from "path";
import { EmployeeForm } from "~/components/EmployeeForm";
import { validateEmployee } from "controller/employeeController";

export const loader = async ({ params }: any) => {
  const db = await getDB();
  const employee = await db.get("SELECT * FROM employees WHERE id = ?", params.employeeId);
  return { employee };
};

export const action: ActionFunction = async ({ request, params }) => {
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

  const db = await getDB();
  const employee = await db.get("SELECT * FROM employees WHERE id = ?", params.employeeId);

  if (!employee) {
    throw new Error("Employee not found");
  }

  // **Ensure files are stored in public/uploads**
  const employeeDir = path.join(process.cwd(), "public", "uploads", `employee_${employee.id}`);
  if (!fs.existsSync(employeeDir)) {
    fs.mkdirSync(employeeDir, { recursive: true });
  }

  let photoPath = employee.photo_path;
  let cvPath = employee.cv_path;

  if (photo && photo.size > 0) {
    if (fs.existsSync(path.join(process.cwd(), "public", photoPath))) {
      fs.unlinkSync(path.join(process.cwd(), "public", photoPath));
    }

    const photoName = "photo.png";
    const absolutePhotoPath = path.join(employeeDir, photoName);
    await fs.promises.writeFile(absolutePhotoPath, Buffer.from(await photo.arrayBuffer()));
    photoPath = `/uploads/employee_${employee.id}/${photoName}`;
  }

  if (cv && cv.size > 0) {
    if (fs.existsSync(path.join(process.cwd(), "public", cvPath))) {
      fs.unlinkSync(path.join(process.cwd(), "public", cvPath));
    }

    const cvName = "cv.pdf";
    const absoluteCvPath = path.join(employeeDir, cvName);
    await fs.promises.writeFile(absoluteCvPath, Buffer.from(await cv.arrayBuffer()));
    cvPath = `/uploads/employee_${employee.id}/${cvName}`;
  }

  await db.run(
    `UPDATE employees SET
      full_name = ?, email = ?, phone_number = ?, date_of_birth = ?, job_title = ?, department = ?, salary = ?, photo_path = ?, cv_path = ?
    WHERE id = ?`,
    [
      full_name,
      email,
      phone_number,
      date_of_birth,
      job_title,
      department,
      salary,
      photoPath,
      cvPath,
      params.employeeId,
    ]
  );

  return redirect("/employees");
};


export default function EmployeePage() {
  const { employee } = useLoaderData();
  return <EmployeeForm mode="update" employee={employee} />;
}