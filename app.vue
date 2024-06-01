<template>
  <div>
    <div class="flex flex-col items-center">
      <NuxtPage />
    </div>
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.1s ease-out;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(24px);
}
</style>