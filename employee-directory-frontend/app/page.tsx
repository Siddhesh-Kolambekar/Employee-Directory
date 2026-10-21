"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface Employee {
  id?: number;
  name: string;
  email: string;
  role: string;
}

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployee, setNewEmployee] = useState<Employee>({
    name: "",
    email: "",
    role: "",
  });
  const [isEmployeeEditing, setIsEmployeeEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:8080/employees");
      setEmployees(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addEmployee = async () => {
    try {
      await axios.post("http://localhost:8080/add-employee", newEmployee);

      await fetchEmployees();
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  const updateEmployee = async (id: number) => {
    try {
      await axios.put(
        `http://localhost:8080/update-employee/${id}`,
        newEmployee,
      );

      await fetchEmployees();
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteEmployee = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/delete-employee/${id}`);

      await fetchEmployees();

      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const editEmployee = (employee: Employee) => {
    setNewEmployee({
      name: employee.name,
      email: employee.email,
      role: employee.role,
    });

    setEditingId(employee.id!);
    setIsEmployeeEditing(true);
  };

  const resetForm = () => {
    setNewEmployee({
      name: "",
      email: "",
      role: "",
    });

    setIsEmployeeEditing(false);
    setEditingId(null);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div>
      <h1>Employee Directory</h1>

      <input
        type="text"
        placeholder={isEmployeeEditing ? "Update Name" : "Enter Name"}
        value={newEmployee.name}
        onChange={(e) =>
          setNewEmployee({
            ...newEmployee,
            name: e.target.value,
          })
        }
      />

      <input
        type="email"
        placeholder={isEmployeeEditing ? "Update Email" : "Enter Email"}
        value={newEmployee.email}
        onChange={(e) =>
          setNewEmployee({
            ...newEmployee,
            email: e.target.value,
          })
        }
      />

      <input
        type="text"
        placeholder={isEmployeeEditing ? "Update Role" : "Enter Role"}
        value={newEmployee.role}
        onChange={(e) =>
          setNewEmployee({
            ...newEmployee,
            role: e.target.value,
          })
        }
      />

      <button
        onClick={() => {
          if (
            !newEmployee.name.trim() ||
            !newEmployee.email.trim() ||
            !newEmployee.role.trim()
          ) {
            alert("Please fill in all fields.");
            return;
          }

          if (isEmployeeEditing && editingId !== null) {
            updateEmployee(editingId);
          } else {
            addEmployee();
          }
        }}
      >
        {isEmployeeEditing ? "Save Changes" : "Add Employee"}
      </button>

      {isEmployeeEditing && <button onClick={resetForm}>Cancel</button>}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th colSpan={2}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.role}</td>

              <td>
                <button onClick={() => editEmployee(employee)}>Edit</button>
              </td>

              <td>
                <button onClick={() => deleteEmployee(employee.id!)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
