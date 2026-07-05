import { Dexie, type EntityTable } from "dexie";

export interface Task {
  id: number;
  title: string;
}

export const db = new Dexie("vlaem.planner-db") as Dexie & {
  tasks: EntityTable<Task, "id">;
};

db.version(1).stores({
  tasks: "++id, title",
});
