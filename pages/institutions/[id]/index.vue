<script setup lang="ts">
const route = useRoute()
const { data: institutionData } = await useFetch(`/api/institutions/${route.params.id}`)
const institution:Institution = institutionData.value as Institution
</script>

<template>
    <div>
        <span><img :src="institution.icon" /><h1>{{ institution.name }}</h1></span>
        <p></p>
        <!-- <InstitutionCard :institution="institution"></InstitutionCard> -->
        TODO: display accounts related to this institution
    </div>
</template>