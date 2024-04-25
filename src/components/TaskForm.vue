<template>
  <div class="container">
    <h2 class="text-center mt-2">Create New Task</h2>
    <form @submit.prevent="submitForm" class="my-3 text-center">
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-text-field
            v-model="newTask.description"
            :counter="100"
            label="Task Name"
            variant="solo-filled"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-btn color="success" type="submit">Add Task</v-btn>
        </v-col>
      </v-row>
    </form>
  </div>

</template>

<script>
import { reactive } from "vue";
import { db } from "../FireBaseConfig";
import { addDoc, collection } from "firebase/firestore";
import {useToast} from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

export default {
  setup() {
    const newTask = reactive({
      creationTime: null,
      description: "",
      completed: false,
    });
    const tasksCollection = collection(db, "tasks");
    const toast = useToast()
    const createNewTask = () => {
      addDoc(tasksCollection, {
        ...newTask,
        creationTime: Date.now(),
      });
      newTask.description = "";
    };
    const submitForm = () => {
      if (newTask.description.trim()) {
        createNewTask();
        // console.log(tasksCollection)
      } else {
        toast.error('enter task',{
          position:'top-right',
          pauseOnHover:true,
          duration: 2000
        })
      }
    };

    return {
      newTask,
      submitForm,
    };
  },
};
</script>
