<script setup lang="ts">
  import TodoListItem from '@/components/TodoListItem.vue';
  import type { Todo } from '@/types/todo';
import { computed } from 'vue';

  const props = defineProps<{
    todos: Todo[]
  }>();

  const total = computed(() => props.todos.length);
  const completed = computed(() => props.todos.filter(t => t.isCompleted)?.length);
  const remaining = computed(() => props.todos.filter(t => !t.isCompleted)?.length);

</script>

<template>
  <div class="container">
    <div class="list-details">
      <span>Total: {{ total }}</span>
      <span>Completed: {{ completed }}</span>
      <span>Remaining: {{ remaining }}</span>
    </div>
    <div class="list-container">
      <TodoListItem v-for="todo in todos" :key="todo.id" :todo="todo" />
    </div>
  </div>
</template>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  div.list-details {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  div.list-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
</style>
