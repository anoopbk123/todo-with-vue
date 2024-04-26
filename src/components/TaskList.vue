<template>
  <div class="container my-2 p-1">
    <h2 class="text-center">Tasks</h2>
    <div class="list">
      <v-container
        v-for="{ id, description, completed } in tasks"
        :key="id"
        class="d-flex justify-space-between bg-black my-1 item"
      >
        <div :class="{ completed: completed }" class="mx-2">
          {{ description }}
        </div>
        <div>
          <RouterLink :to="'/editTask?taskID=' + id">
            <v-btn color="warning" class="mx-2"> Edit </v-btn>
          </RouterLink>
          <v-btn color="red-darken-1"> Delete </v-btn>
        </div>
      </v-container>
    </div>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";
import { collection, onSnapshot, QuerySnapshot } from "firebase/firestore";
import { db } from "../FireBaseConfig"; // Assuming Firebase app initialization in a separate file
import { onUnmounted, ref } from "vue";

export default {
  setup() {
    const tasks = ref([]);
    const tasksCollection = collection(db, "tasks"); // Reference to the tasks collection

    const getTasks = async () => { // Use async/await for cleaner handling
      try {
        const unsubscribe = onSnapshot(tasksCollection, (querySnapshot) => {
          tasks.value = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(), // Spread operator for all data fields
          }));
        });

        // Cleanup on component unmount
        return () => unsubscribe();
      } catch (err) {
        console.error("Error fetching tasks:", err); // Handle errors gracefully
      }
    };

    getTasks();

    onUnmounted(() => { // Ensure cleanup even if getTasks throws
      unsubscribe();
    });

    return { tasks };
  },
};
</script>

<style scoped>
/* Your existing styles here */
</style>


<style scoped>
.item {
  transition: transform 0.5s;
}
.item:hover {
  transform: scale(1.025);
}
.completed {
  text-decoration: line-through;
}
</style>
