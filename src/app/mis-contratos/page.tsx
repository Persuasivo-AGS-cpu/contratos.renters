import { redirect } from "next/navigation";

// Dashboard de clientes aún no existe (requiere auth de usuarios).
// Esta ruta mostraba datos mock públicos; se redirige hasta que se construya.
export default function MisContratosPage() {
  redirect("/");
}
