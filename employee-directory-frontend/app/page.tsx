"use client";

import { useState, useEffect } from "react";

interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:3000/employees");
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEmployees();
  }, []);
  return (<div>
    <table>
      {employees.map((employee) => (<tr key={employee.id}>
          <td>{employee.name}</td>
          <td>{employee.email}</td>
          <td>{employee.role}</td>
        </tr>))}
    </table>
  </div>);
}
