<script setup lang="ts">
let isLoading = ref(false)
const formData = reactive({
    name:  '',
    url: '',
    icon: ''
})

const submit = () => {
    isLoading.value = true
    $fetch('/api/institutions/create', {
        method: 'POST',
        body: formData,
        onResponse() {
            setTimeout(() => {
                isLoading.value = false
                navigateTo('/institutions')
            }, 250)
        }
    })
}
</script>

<template>
    <div>
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
        <div role="dialog" :class="isLoading ? 'modal modal-open' : 'modal'">
            <div class="modal-box flex justify-center w-36">
                <span class="loading loading-spinner loading-lg"></span>
            </div>
        </div>
    </div>
</template>