<template>
    <header class="grid-container py-4 text-lg font-medium relative">
        <div class="w-full flex items-center gap-6 justify-between rounded-xl shadow-[0px_0px_20px_-13px_black] px-4 py-2 bg-[#2C2C2C]">
            <NuxtLink to="/" class="flex items-center gap-2 text-sky-500 transition-all duration-500 hover:opacity-70">
                <Icon class="text-3xl" name="hugeicons:job-search"/>
                <span class="text-xl font-mono font-semibold">QuickServe</span>
            </NuxtLink>
            <div class="flex items-center gap-6 max-lg:absolute max-lg:w-full max-lg:flex-col max-lg:py-6 text-white max-lg:bg-[#2C2C2C] max-lg:left-0 max-lg:border-t border-sky-500 transition-all duration-500 z-[5]" :class="isMenuShow ? 'max-lg:top-full' : 'max-lg:top-0 max-lg:-translate-y-full'">
                <NuxtLink class="flex flex-col after:w-0 after:h-px after:bg-white after:transition-all after:duration-500 hover:after:w-full" to="/">Главная</NuxtLink>
                <NuxtLink class="flex flex-col after:w-0 after:h-px after:bg-white after:transition-all after:duration-500 hover:after:w-full" to="/vacancies" >Вакансии</NuxtLink>
                <NuxtLink class="flex flex-col after:w-0 after:h-px after:bg-white after:transition-all after:duration-500 hover:after:w-full" to="/about">О нас</NuxtLink>
                <NuxtLink to="/auth" class="flex transition-all duration-500 hover:opacity-70">
                    <Icon class="text-3xl text-sky-500" name="material-symbols:person"/>
                </NuxtLink>
            </div>
            <button @click="isMenuShow = !isMenuShow" class="lg:hidden flex cursor-pointer">
                <Icon class="text-3xl text-sky-500" name="ic:round-menu"/>
            </button>
        </div>
        <div @click="isMenuShow = false" class="lg:hidden fixed z-[4] inset-0 bg-black/30 top-[85px]" :class="{'max-lg:hidden' : !isMenuShow}"></div>
        <button type="button" @click="messageTitle = null" class="fixed top-10 right-10 z-[11] cursor-pointer flex items-center gap-2 px-6 py-2 text-lg rounded-xl w-fit font-medium font-mono border-white border bg-[#131313]/10 shadow-[0px_0px_13px_-7px_black]" :class="messageType ? ' text-white' : 'text-red-500'" v-if="messageTitle">
            <Icon class="text-3xl" name="material-symbols:close-small-rounded"/>
            <span>{{messageTitle}}</span>
        </button>
    </header>
</template>

<script setup>
/* открытие мобильного меню */
const isMenuShow = ref(false) 


/* закрытие мобильного меню */
const nuxtApp = useNuxtApp()
nuxtApp.hook('page:start', () => {
    isMenuShow.value = false
})


/* создание сообщений */
const { messageTitle, messageType } = storeToRefs(useMessagesStore())


/* проверка роли */
const userStore = useUserStore()

</script>