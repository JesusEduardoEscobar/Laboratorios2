import { useEffect, useState, type ChangeEvent, type JSX } from "react";
import "./App.css";
import supabase from "./supabase-client";

// Interfaz para los empleados
interface Employee {
  id: number;
  name: string;
  position: string;
  email: string;
  salary: number;
}

function App(): JSX.Element {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [name, setName] = useState<string>("");
  const [position, setPosition] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [salary, setSalary] = useState<string>("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Obtener empleados
  const fetchEmployees = async (): Promise<void> => {
    const { data, error } = await supabase
      .from("Empleados")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.log("Error fetching employees:", error);
    } else {
      setEmployees((data as Employee[]) || []);
    }
  };

  // Agregar empleado
  const addEmployee = async (): Promise<void> => {
    if (!name || !position || !email || !salary) return;

    const { data, error } = await supabase
      .from("Empleados")
      .insert([
        {
          name,
          position,
          email,
          salary: Number(salary),
        },
      ])
      .select()
      .single();

    if (error) {
      console.log("Error adding employee:", error);
    } else if (data) {
      setEmployees((prev) => [...prev, data as Employee]);
      setName("");
      setPosition("");
      setEmail("");
      setSalary("");
    }
  };

  // Editar empleado
  const editEmployee = async (employee: Employee): Promise<void> => {
    const newName = prompt("Nuevo nombre:", employee.name);
    const newPosition = prompt("Nuevo puesto:", employee.position);
    const newEmail = prompt("Nuevo correo:", employee.email);
    const newSalary = prompt(
      "Nuevo salario:",
      employee.salary.toString()
    );

    if (!newName || !newPosition || !newEmail || !newSalary) return;

    const { error } = await supabase
      .from("Empleados")
      .update({
        name: newName,
        position: newPosition,
        email: newEmail,
        salary: Number(newSalary),
      })
      .eq("id", employee.id);

    if (error) {
      console.log("Error updating employee:", error);
    } else {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === employee.id
            ? {
                ...emp,
                name: newName,
                position: newPosition,
                email: newEmail,
                salary: Number(newSalary),
              }
            : emp
        )
      );
    }
  };

  // Eliminar empleado
  const deleteEmployee = async (id: number): Promise<void> => {
    const { error } = await supabase
      .from("Empleados")
      .delete()
      .eq("id", id);

    if (error) {
      console.log("Error deleting employee:", error);
    } else {
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    }
  };

  return (
    <div>
      <h1>Lista de Empleados</h1>

      <div>
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
          }
        />
        <input
          type="text"
          placeholder="Puesto"
          value={position}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPosition(e.target.value)
          }
        />
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
        <input
          type="number"
          placeholder="Salario"
          value={salary}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSalary(e.target.value)
          }
        />
        <button onClick={addEmployee}>Agregar Empleado</button>
      </div>

      <ul>
        {employees.map((employee) => (
          <li key={employee.id}>
            <p>
              {employee.name} - {employee.position} - {employee.email} - $
              {employee.salary}
            </p>
            <button onClick={() => editEmployee(employee)}>Editar</button>
            <button onClick={() => deleteEmployee(employee.id)}>
              Eliminar
            </button>
          </li>
        ))}
        {employees.length === 0 && <p>No hay empleados registrados</p>}
      </ul>
    </div>
  );
}

export default App;