<script setup lang="ts">
const { data } = useFetch('/api/institutions')
</script>

<template>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 place-items-center">
        <InstitutionCard v-for="institution in data" :institution="institution" />
        <NuxtLink class="btn btn-outline btn-primary" to="/institutions/new">New</NuxtLink>
    </div>
</template>