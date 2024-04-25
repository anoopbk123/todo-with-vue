<template>
    <div class="todo-container">
        <TaskForm/>
        <TaskList/>
    </div>
</template>

<script>
import TaskForm from '@/components/TaskForm.vue'
import TaskList from '@/components/TaskList.vue'
    export default {
        name: 'ToDo',
        components:{
            TaskForm,
            TaskList
        }
    }
</script>

<style scoped>

</style>