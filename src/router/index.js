import { createRouter, createWebHistory } from 'vue-router'
import ToDo from '../views/ToDo.vue'
import TaskEditor from '../views/TaskEditor.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'todo',
      component: ToDo
    },
    {
      path:'/editTask',
      name:'TaskEditor',
      component: TaskEditor
    }
  ]
})

export default router
