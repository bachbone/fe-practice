<script setup lang="ts">
  import { ref } from "vue";

  import TodoForm from '@/components/TodoForm.vue';
  import TodoList from '@/components/TodoList.vue';

  import type { Todo } from '@/types/todo';

  const todos = ref<Todo[]>([]);

  function addTodo({ content }: { content: string }) {
    const newTodo = {
      id: crypto.randomUUID(),
      content: content,
      isCompleted: false
    } as Todo;

    todos.value.push(newTodo);
  }
</script>

<template>
  <div class="page-container">
    <TodoForm @submit="addTodo" />
    <TodoList :todos="todos" />
  </div>
</template>

<style scoped>
  div.page-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
</style>
