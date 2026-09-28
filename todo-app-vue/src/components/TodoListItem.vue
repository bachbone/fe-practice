<script setup lang="ts">
  import type { Todo } from '@/types/todo';
  defineProps<{
    todo: Todo
  }>();
</script>

<template>
  <div class="list-item-container">
    <input type="checkbox" v-model="todo.isCompleted" />
    <span>{{ todo.content }}</span>
  </div>
</template>

<style scoped>
  .list-item-container {
    display: flex;
    flex-direction: row;
  }
</style>
