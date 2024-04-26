<template>
  <div class="taskEditor">
    <h2 class="text-center">Task Editor</h2>
    <form @submit.prevent="submitForm" class="my-3 text-center">
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-text-field
            v-model="taskDescription"
            :counter="100"
            label="Task Description"
            variant="solo-filled"
          ></v-text-field>
        </v-col>
        <label
          ><input v-model="taskCompleted" type="checkbox" /> Completed</label
        >
        <v-col cols="12" md="3">
          <v-btn color="warning" type="submit">Update Task</v-btn>
        </v-col>
      </v-row>
    </form>
    <v-container v-if="taskData">
      <div>Created at: {{ new Date(taskData.creationTime) }}</div>
      <div v-if="taskData.updatedTime">Updated at: {{ new Date() }}</div>
    </v-container>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../FireBaseConfig";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

export default {
  setup() {
    const taskData = ref(null);
    const route = useRoute();
    const { taskID } = route.query;
    const taskDescription = ref("");
    const taskCompleted = ref(false);
    const toast = useToast();

    const getTask = async () => {
      try {
        if (taskID) {
          const taskRef = doc(db, "tasks", taskID);
          const taskSnap = await getDoc(taskRef);

          if (taskSnap.exists()) {
            taskData.value = taskSnap.data();
            taskDescription.value = taskData.value.description;
            taskCompleted.value = taskData.value.completed;
          } else {
            toast.error("Task document not found:", taskID);
          }
        }
      } catch (err) {
        toast.error("Error fetching tasks", {
          position: "top-right",
          pauseOnHover: true,
          duration: 2000,
        });
        console.error("Error fetching tasks:", err);
      }
    };

    const submitForm = async () => {
      try {
        if (taskID) {
          const taskRef = doc(db, "tasks", taskID);
          await updateDoc(taskRef, {
            description: taskDescription.value,
            completed: taskCompleted.value,
            updatedTime: Date.now(), // Update timestamp
          });
          await getTask();
          toast.success("Task updated successfully:", {
            position: "top-right",
            pauseOnHover: true,
            duration: 2000,
          });
        }
      } catch (err) {
        console.error("Error updating task:", taskID, err);
        toast.error("Error updating task", {
            position: "top-right",
            pauseOnHover: true,
            duration: 2000,
          });
      }
    };

    onMounted(async () => {
      await getTask();
    });

    return { taskData, taskDescription, taskCompleted, submitForm };
  },
};
</script>

<style scoped></style>
