<template>
  <div class="container my-2 p-1">
    <h2 class="text-center">Tasks</h2>
    <div class="list">
      <v-container
        v-for="{ id, description, complelted } in tasks"
        :key="id"
        class="d-flex justify-space-between bg-black my-1 item"
      >
        <div :class="{ completed: completed }" class="mx-2">
          {{ description }}
        </div>
        <div>
          <RouterLink :to="'/editTask?taskID='+id">
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
import { collection, onSnapshot } from "firebase/firestore";
import {db} from "../FireBaseConfig"

export default {
    setup(){
    const tasksCollection = collection(db, "tasks");
    

    }
};
</script>

<style scoped>
.item {
  transition: transform 0.5s;
}
.item:hover {
  transform: scale(1.025);
}
.completed{
    text-decoration: line-through;
}
</style>
