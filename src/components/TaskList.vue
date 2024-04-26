<template>
  <div class="container my-2 p-1">
    <h2 class="text-center">Tasks</h2>
    <div class="list" v-if="tasks.length">
      <v-container
        v-for="{ id, description, completed } in tasks"
        :key="id"
        class="d-flex justify-space-between bg-black my-1 item"
      >
        <div :class="{ completed: completed }" @click='updateTaskCompletion(id)' class="mx-2 cursor-pointer">
          {{ description }}
        </div>
        <div>
          <RouterLink :to="'/editTask?taskID=' + id">
            <v-icon>{{ mdiPencil }}</v-icon>
          </RouterLink>
          <v-btn @click="deleteTask(id)" color="red-darken-1"> Delete </v-btn>
        </div>
  
      </v-container>
      <v-icon :icon="`mdiSvg:${mdiPencil}`"></v-icon>
    </div>
    <div v-else class="text-center">
      No Tasks
    </div>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";
import { collection, onSnapshot, QuerySnapshot, doc, deleteDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../FireBaseConfig";
import { onUnmounted, ref, onMounted } from "vue";
import {useToast} from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import {
    mdiDelete,
    mdiPencil,
  } from '@mdi/js'

console.log('pencil', mdiPencil)
export default {
  setup() {
    const tasks = ref([]);
    const error = ref(null); // Consider adding error handling
    const toast = useToast()

    const getTasks = async () => {
      try {
        const unsubscribe = onSnapshot(collection(db, "tasks"), (querySnapshot) => {
          tasks.value = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        });

        return () => unsubscribe();
      } catch (err) {
        toast.error('Error fetching tasks',{
          position:'top-right',
          pauseOnHover:true,
          duration: 2000
        })
        console.error("Error fetching tasks:", err);
      }
    };

    onMounted(async () => {
      await getTasks();
    });


    const deleteTask = async (taskID) => {
      try {
        await deleteDoc(doc(db, "tasks", taskID));
        await getTasks()
        toast.success('Task deleted',{
          position:'top-right',
          pauseOnHover:true,
          duration: 2000
        })
        // console.log("Task deleted successfully:", taskID);
      } catch (err) {
        toast.error('Failed to delete',{
          position:'top-right',
          pauseOnHover:true,
          duration: 2000
        })
        
      }
    };

    const updateTaskCompletion = async (taskID)=>{
      try{
         const taskRef = doc(db, "tasks", taskID); // Reference the specific task document
    // console.log(taskRef)

    // Fetch the current document data (including completed flag)
    const taskSnap = await getDoc(taskRef);
    const taskData = taskSnap.data();

    // Update the completed flag to the opposite of its current value
    const newCompleted = !taskData.completed; // Toggle completed state

    await updateDoc(taskRef, {
      completed: newCompleted,
      updatedTime: Date.now() // Update timestamp as well
    });

    //  refetch tasks to reflect the update in the UI
    await getTasks();

    toast.success('Task completion updated!', {
      position: 'top-right',
      pauseOnHover: true,
      duration: 2000
    });
      }
      catch (err) {
        toast.error('Failed to update',{
          position:'top-right',
          pauseOnHover:true,
          duration: 2000
        })
        
      }
    }

    return { tasks, error, deleteTask, updateTaskCompletion,
    mdiDelete,
    mdiPencil,
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
