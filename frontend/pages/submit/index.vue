<template>
  <div></div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  // 重定向到 /submit/item
  router.replace("/submit/item");
});
</script>
