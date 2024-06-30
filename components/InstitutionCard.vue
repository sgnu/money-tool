<script setup lang="ts">
const props = defineProps<{
    institution: Institution
}>()

// TODO: add emit so page can update when an institution gets deleted

const deleteInstitution = async () => {
    await $fetch('/api/institutions', {
        method: 'DELETE',
        body: props.institution
    })
}
</script>

<template>
    <CardBase>
        <div class="card-body">
            <NuxtLink :to="`/institutions/${institution.id}`">
                <h2 class="card-title">
                    <img :src="institution.icon" class="w-8 h-8" />
                    {{ institution.name }}
                </h2>
            </NuxtLink>
            <div class="card-actions justify-end">
                <div class="join">
                    <NuxtLink class="btn btn-outline btn-sm join-item w-fit" :to="`/institutions/${institution.id}/edit`">Edit</NuxtLink>
                    <button class="btn btn-outline btn-sm btn-error join-item w-fit" @click="deleteInstitution">Delete</button>
                </div>
            </div>
        </div>
    </CardBase>
</template>