<template>
  <div class="container my-2 p-1">
    <h2 class="text-center">Tasks</h2>
    <div class="my-3">
      <label class="font-weight-bold pa-2" 
      >Filter :
      <select class="pa-2" v-model="filter">
        <option value="true">Completed</option>
        <option value="false">Uncompleted</option>
        <option value="all">All</option>
      </select></label
    >

    </div>
    <div class="list" v-if="tasks.length">
      <v-container
        v-for="{ id, description, completed } in filteredTasks"
        :key="id"
        class="d-flex justify-space-between bg-black my-1 item"
      >
        <div
          :class="{ completed: completed }"
          @click="updateTaskCompletion(id)"
          class="mx-2 cursor-pointer"
        >
          {{ description }}
        </div>
        <div>
          <RouterLink class="mx-3" :to="'/editTask?taskID=' + id">
            <svg-icon type="mdi" :path="mdiPencil"></svg-icon>
          </RouterLink>
          <svg-icon
            @click="deleteTask(id)"
            type="mdi"
            :path="mdiDelete"
          ></svg-icon>
        </div>
      </v-container>
    </div>
    <div v-else class="text-center">No Tasks</div>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";
import {
  collection,
  onSnapshot,
  QuerySnapshot,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../FireBaseConfig";
import { onUnmounted, ref, onMounted, watch } from "vue";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import { mdiDelete, mdiPencil } from "@mdi/js";
import SvgIcon from "@jamescoyle/vue-icon";
export default {
  components: {
    SvgIcon,
  },
  setup() {
    const tasks = ref([]);
    const error = ref(null);
    const toast = useToast();
    const filter = ref("all");
    const filteredTasks = ref([]);

    const getTasks = async () => {
      try {
        const unsubscribe = onSnapshot(
          collection(db, "tasks"),
          (querySnapshot) => {
            tasks.value = querySnapshot.docs
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
              .sort((a, b) => b.creationTime - a.creationTime);
          }
        );
        return () => unsubscribe();
      } catch (err) {
        toast.error("Error fetching tasks", {
          position: "top-right",
          pauseOnHover: true,
          duration: 2000,
        });
        console.error("Error fetching tasks:", err);
      }
    };

    onMounted(async () => {
      await getTasks();
    });

    const deleteTask = async (taskID) => {
      try {
        await deleteDoc(doc(db, "tasks", taskID));
        toast.success("Task deleted", {
          position: "top-right",
          pauseOnHover: true,
          duration: 2000,
        });
        // console.log("Task deleted successfully:", taskID);
      } catch (err) {
        toast.error("Failed to delete", {
          position: "top-right",
          pauseOnHover: true,
          duration: 2000,
        });
      }
    };

    const updateTaskCompletion = async (taskID) => {
      try {
        const taskRef = doc(db, "tasks", taskID);
        // console.log(taskRef)

        // Fetch the current document data (including completed flag)
        const taskSnap = await getDoc(taskRef);
        const taskData = taskSnap.data();

        const newCompleted = !taskData.completed; // Toggle completed state

        await updateDoc(taskRef, {
          completed: newCompleted,
          updatedTime: Date.now(),
        });

        toast.success("Task completion updated!", {
          position: "top-right",
          pauseOnHover: true,
          duration: 2000,
        });
      } catch (err) {
        toast.error("Failed to update", {
          position: "top-right",
          pauseOnHover: true,
          duration: 2000,
        });
      }
    };

    const filterTasks = () => {
      filteredTasks.value = tasks.value.filter((value) => {
        // console.log(value.creationTime)

        if (filter.value === "all") {
          return true;
        }
        if (filter.value === "true") {
          return value.completed === true;
        }
        if (filter.value === "false") {
          return value.completed === false;
        }
      });
    };

    watch(tasks, filterTasks);
    watch(filter, filterTasks);

    return {
      tasks,
      filteredTasks,
      error,
      deleteTask,
      updateTaskCompletion,
      mdiDelete,
      mdiPencil,
      filter,
    };
  },
};
</script>

<style scoped>
.item {
  transition: transform 0.5s;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
}
.item:hover {
  transform: scale(1.025);
}
.completed {
  text-decoration: line-through;
}
</style>
