<script setup>
import { RouterLink, RouterView } from "vue-router";

</script>

<template>
<h1 class="text-center my-2">Task Manager</h1>
  <v-container>
    <v-row justify="center" class="app-container border-lg  border-info">
      <v-col cols="12" md="8">
      <RouterView />
      </v-col>
    </v-row>
  </v-container>
  
</template>

<style scoped></style>
