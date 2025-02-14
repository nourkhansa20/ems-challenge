import { Link, useLoaderData } from "react-router";
import { getDB } from "~/db/getDB";
import { useState } from "react";
import { useNavigate } from "react-router"; // Import useNavigate
import TableComponent from "~/components/TableComponent";

export async function loader() {
  const db = await getDB();
  const employees = await db.all("SELECT * FROM employees;");
  return { employees };
}

export default function EmployeesPage() {
  const { employees } = useLoaderData();
  const navigate = useNavigate(); // Use navigate

  const headers = ["full_name", "email", "phone_number", "job_title", "department"];

  return (
    <div  className="w-full">
      <div className="flex justify-between items-center">

        <ul className="li-container">
          <li className="li-button"><Link to="/timesheets/">Timesheets</Link></li>
        </ul>
        
      </div>

      <TableComponent
        name="employee"
        data={employees}
        headers={headers}
        rowsPerPage={5}
        onRowClick={(row) => navigate(`/employees/${row.id}`)} // Use navigate for redirection
        renderColumn={({ column, value }) => column === "salary" ? `$${value.toLocaleString()}` : value}
      />

    </div>
  );
}
