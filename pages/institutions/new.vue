<script setup lang="ts">
let isLoading = true
const formData = reactive({
    name:  '',
    url: '',
    icon: ''
})

const submit = async () => {
    loading_modal.showModal()
    isLoading = true
    await $fetch('/api/institutions/create', {
        method: 'POST',
        body: formData,
        onResponse() {
            setTimeout(() => {
                // isLoading = false
                navigateTo('/institutions')
            }, 250)
        }
    })
    console.log(formData)
}
</script>

<template>
    <div class="overflow-auto">
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
        </form>
        <dialog id="loading_modal" class="modal" v-if="isLoading">
            <div class="modal-box flex justify-center w-36">
                <span class="loading loading-spinner loading-lg"></span>
            </div>
        </dialog>
    </div>
</template>