"use client";

import { useEffect, useState, ChangeEvent } from "react";
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase.config";

// Interfaz para los empleados
interface Employee {
  id: string;
  name: string;
  position: string;
  email: string;
  salary: number;
}

export default function Home(): JSX.Element {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [formData, setFormData] = useState<Omit<Employee, "id">>({
    name: "",
    position: "",
    email: "",
    salary: 0,
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Obtener empleados
  const fetchEmployees = async (): Promise<void> => {
    const snapshot = await getDocs(collection(db, "employees"));
    const employeeList: Employee[] = snapshot.docs.map((docSnapshot) => ({
      id: docSnapshot.id,
      ...(docSnapshot.data() as Omit<Employee, "id">),
    }));
    setEmployees(employeeList);
  };

  // Manejar cambios en los inputs
  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "salary" ? Number(value) : value,
    }));
  };

  // Agregar empleado
  const handleAdd = async (): Promise<void> => {
    if (!formData.name || !formData.email) return;

    await addDoc(collection(db, "employees"), formData);
    setFormData({
      name: "",
      position: "",
      email: "",
      salary: 0,
    });
    fetchEmployees();
  };

  // Eliminar empleado
  const handleDelete = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, "employees", id));
    fetchEmployees();
  };

  // Editar empleado
  const handleEdit = async (employee: Employee): Promise<void> => {
    const name = prompt("Nuevo nombre:", employee.name);
    const position = prompt("Nuevo puesto:", employee.position);
    const email = prompt("Nuevo email:", employee.email);
    const salary = prompt(
      "Nuevo salario:",
      employee.salary.toString()
    );

    if (!name || !position || !email || !salary) return;

    await updateDoc(doc(db, "employees", employee.id), {
      name,
      position,
      email,
      salary: Number(salary),
    });

    fetchEmployees();
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1 className="text-2xl font-bold">Tabla de Empleados</h1>

      {/* Formulario */}
      <div className="flex flex-col gap-2 w-full max-w-md">
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          className="border-2 p-2 rounded"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="position"
          placeholder="Puesto"
          className="border-2 p-2 rounded"
          value={formData.position}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Correo"
          className="border-2 p-2 rounded"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="number"
          name="salary"
          placeholder="Salario"
          className="border-2 p-2 rounded"
          value={formData.salary}
          onChange={handleChange}
        />
        <button
          className="border p-2 bg-blue-500 text-white rounded"
          onClick={handleAdd}
        >
          Agregar Empleado
        </button>
      </div>

      {/* Tabla */}
      <div className="w-full max-w-4xl overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 mt-6">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Puesto</th>
              <th className="border p-2">Correo</th>
              <th className="border p-2">Salario</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id} className="text-center">
                <td className="border p-2">{employee.name}</td>
                <td className="border p-2">{employee.position}</td>
                <td className="border p-2">{employee.email}</td>
                <td className="border p-2">
                  ${employee.salary.toLocaleString()}
                </td>
                <td className="border p-2 space-x-2">
                  <button
                    className="p-2 border bg-yellow-500 text-white rounded"
                    onClick={() => handleEdit(employee)}
                  >
                    Editar
                  </button>
                  <button
                    className="p-2 border bg-red-500 text-white rounded"
                    onClick={() => handleDelete(employee.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="border p-4 text-center text-gray-500"
                >
                  No hay empleados registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}