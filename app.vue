<template>
  <div class="drawer lg:drawer-open">
    <input id="nav-drawer" type="checkbox" class="drawer-toggle">

    <div class="drawer-content flex flex-col">
      <div class="w-screen navbar bg-base-300 lg:hidden">
        <div class="flex-none">
          <label for="nav-drawer" aria-label="open sidebar" class="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
              <path fill-rule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd" />
            </svg>
          </label>
        </div>
      </div>
    <div class="pt-4 lg:pt-16 pb-8 px-4 sm:px-24">
      <NuxtPage />
    </div>
    </div>


    <div class="drawer-side">
      <ul class="menu p-4 w-full lg:w-56 min-h-full bg-base-200 z-50">
        <li class="lg:hidden">
          <label for="nav-drawer" aria-label="close sidebar" class="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
              <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
            </svg>
          </label>
        </li>
        <li><NuxtLink to="/accounts">Accounts</NuxtLink></li>
        <li><NuxtLink to="/institutions">Institutions</NuxtLink></li>
        <li><NuxtLink to="/transactions">Transactions</NuxtLink></li>
      </ul>
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
/* 
body {
  max-width: 100vw;
  height: 100svh;
  overflow: hidden;
} */
</style>