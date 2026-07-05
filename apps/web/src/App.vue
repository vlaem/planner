<template>
  <h1>Planner Frontend</h1>
  <label class="text-4xl">
    <span>Brain Dump</span>
    <input
      type="text"
      placeholder="Add a new task here!"
      v-model="newTask"
      @keydown="onNewTaskKeyDown"
    />
  </label>
  <TaskComponent
    v-for="task in tasks"
    :key="task.id"
    :title="task.title"
    :id="task.id"
    @delete="onDeleteTask"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { db, type Task } from "./db/index";
import TaskComponent from "./components/Task.vue";

const newTask = ref("");
const tasks = ref<Task[]>([]);

async function loadTasks() {
  tasks.value = await db.tasks.toArray();
}

async function saveTask() {
  if (newTask.value.trim() === "") {
    return;
  }

  await db.tasks.add({
    title: newTask.value,
  });

  newTask.value = "";
  await loadTasks();
}

async function onNewTaskKeyDown(event: KeyboardEvent) {
  if (event.key === "Enter") {
    await saveTask();
  }
}

async function onDeleteTask(taskId: number) {
  await db.tasks.delete(taskId);
  await loadTasks();
}

onMounted(async () => {
  await loadTasks();
});
</script>
