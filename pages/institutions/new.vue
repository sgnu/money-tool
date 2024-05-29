<script setup lang="ts">
let isLoading = false
const formData = reactive({
    name:  '',
    url: '',
    icon: ''
})

const submit = async () => {
    isLoading = true
    await $fetch('/api/institutions/createInstitution', {
        method: 'POST',
        body: formData,
        onResponse() {
            isLoading = false
            navigateTo('/institutions')
        }
    })
    console.log(formData)
}
</script>

<template>
    <form class="max-w-96 flex flex-col gap-2 items-end shadow-md p-8 rounded">
        <label class="input input-bordered flex items-center gap-2 w-[100%]">
            Name
            <input type="text" class="grow" v-model="formData.name" />
        </label>
        <label class="input input-bordered flex items-center gap-2 w-[100%]">
            URL
            <input type="text" class="grow" v-model="formData.url" />
        </label>
        <label class="input input-bordered flex items-center gap-2 w-[100%]">
            Favicon
            <input type="text" class="grow" v-model="formData.icon"/>
        </label>
        <button type="submit" class="btn btn-primary" @click.prevent="submit">Create</button>
        <span v-if="isLoading" class="loading loading-spinner"></span>
    </form>
</template>