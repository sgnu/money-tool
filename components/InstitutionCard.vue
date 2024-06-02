<script setup lang="ts">
const props = defineProps<{
    institution: Institution
}>()

// TODO: add emit so page can update when an institution gets deleted

const deleteInstitution = async () => {
    await $fetch('/api/institutions/delete', {
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
            <button class="button btn-error" @click="deleteInstitution">Delete</button>
        </div>
    </CardBase>
</template>