<script setup lang="ts">
const props = defineProps<{
    institution: Institution
}>()


const deleteInstitution = async () => {
    await $fetch('/api/institutions/deleteInstitution', {
        method: 'DELETE',
        body: props.institution
    })
}
</script>

<template>
    <div class="card w-64 bg-base-100 shadow-xl">
        <div class="card-body">
            <a :href="institution.url">
                <h2 class="card-title">
                    <img :src="institution.icon" class="w-8 h-8" />
                    {{ institution.name }}
                </h2>
            </a>
            <button class="button btn-error" @click="deleteInstitution">Delete</button>
        </div>
    </div>
</template>