<script setup lang="ts">
  import { ref } from 'vue';

  const text = ref<string | null>(null);

  const emits = defineEmits(["submit"]);

  function handleSubmit() {
    emits("submit", { content: text.value });
    text.value = null;
  }
</script>

<template>
  <form class="container" @submit.prevent="handleSubmit">
    <input type="text" v-model="text" />
    <button type="submit">Submit</button>
  </form>
</template>

<style scoped>
  form {
    display: flex;
    flex-direction: row;
    gap: 8px;
  }
</style>