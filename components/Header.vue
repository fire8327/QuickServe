<template>
    <header class="grid-container py-4 text-lg font-medium relative">
        <!-- Десктопная версия -->
        <div
            class="w-full flex items-center gap-4 justify-between px-4 py-2 lg:bg-[#2C2C2C]/90 lg:rounded-xl lg:shadow-[0px_0px_20px_-13px_black]">
            <NuxtLink to="/"
                class="flex items-center gap-2 text-sky-500 transition-all duration-500 hover:opacity-70">
                <Icon class="text-3xl" name="hugeicons:job-search" />
                <span class="text-xl font-mono font-semibold">QuickServe</span>
            </NuxtLink>
            <div class="flex items-center gap-4 lg:gap-6 text-white max-lg:hidden">
                <NuxtLink to="/"
                    class="px-3 py-1 bg-[#3C3C3C] rounded-xl shadow-md transition-all duration-500 hover:bg-[#000000]/15 hover:border-sky-500 border border-transparent">
                    Главная
                </NuxtLink>
                <NuxtLink to="/services"
                    class="px-3 py-1 bg-[#3C3C3C] rounded-xl shadow-md transition-all duration-500 hover:bg-[#000000]/15 hover:border-sky-500 border border-transparent">
                    Услуги
                </NuxtLink>
                <NuxtLink to="/chats"
                    class="px-3 py-1 bg-[#3C3C3C] rounded-xl shadow-md transition-all duration-500 hover:bg-[#000000]/15 hover:border-sky-500 border border-transparent">
                    Чаты
                </NuxtLink>
                <NuxtLink to="/about"
                    class="px-3 py-1 bg-[#3C3C3C] rounded-xl shadow-md transition-all duration-500 hover:bg-[#000000]/15 hover:border-sky-500 border border-transparent">
                    О нас
                </NuxtLink>
            </div>
            <div class="flex items-center gap-4">
              <NuxtLink v-if="authenticated" to="/orders" class="flex transition-all duration-500 hover:opacity-70 max-lg:hidden" title="Заказы">
                    <Icon class="text-3xl text-sky-500" name="material-symbols:orders"/>
                </NuxtLink>
                <NuxtLink :to="authenticated ? '/profile' : '/auth'" class="flex transition-all duration-500 hover:opacity-70 max-lg:hidden" :title="authenticated ? 'Профиль' : 'Войти'">
                    <Icon class="text-3xl text-sky-500" name="material-symbols:person"/>
                </NuxtLink>
                <button @click="isMenuShow = !isMenuShow" class="lg:hidden flex cursor-pointer">
                    <Icon class="text-3xl text-sky-500"
                        :name="isMenuShow ? 'material-symbols:close' : 'ic:round-menu'" />
                </button>
            </div>
        </div>

        <!-- Мобильная версия -->
        <div class="lg:hidden fixed bottom-0 left-0 w-full bg-[#2C2C2C] rounded-t-xl shadow-[0px_0px_20px_-13px_black] z-[5] transition-all duration-500"
            :class="isMenuShow ? 'translate-y-0' : 'translate-y-full'">
            <div class="flex flex-col gap-6 p-6 text-white">
                <NuxtLink
                    class="flex flex-col after:w-0 after:h-px after:bg-white after:transition-all after:duration-500 hover:after:w-full"
                    to="/" @click="isMenuShow = false">
                    Главная
                </NuxtLink>
                <NuxtLink
                    class="flex flex-col after:w-0 after:h-px after:bg-white after:transition-all after:duration-500 hover:after:w-full"
                    to="/services" @click="isMenuShow = false">
                    Услуги
                </NuxtLink>
                <NuxtLink
                    class="flex flex-col after:w-0 after:h-px after:bg-white after:transition-all after:duration-500 hover:after:w-full"
                    to="/chats" @click="isMenuShow = false">
                    Чаты
                </NuxtLink>
                <NuxtLink
                    class="flex flex-col after:w-0 after:h-px after:bg-white after:transition-all after:duration-500 hover:after:w-full"
                    to="/about" @click="isMenuShow = false">
                    О нас
                </NuxtLink>
                <div class="flex items-center gap-4">
                    <NuxtLink :to="authenticated ? '/profile' : '/auth'" class="flex transition-all duration-500 hover:opacity-70"
                        @click="isMenuShow = false">
                        <Icon class="text-3xl text-sky-500" name="material-symbols:person" />
                    </NuxtLink>
                    <NuxtLink v-if="authenticated" to="/orders" class="flex transition-all duration-500 hover:opacity-70 max-lg:hidden" title="Заказы">
                        <Icon class="text-3xl text-sky-500" name="material-symbols:orders"/>
                    </NuxtLink>
                </div>
            </div>
        </div>
        <div @click="isMenuShow = false" class="lg:hidden fixed z-[4] inset-0 bg-black/30"
            :class="{ 'max-lg:hidden': !isMenuShow }"></div>
        <button type="button" @click="messageTitle = null"
            class="lg:fixed lg:top-10 lg:right-4 max-lg:sticky max-lg:top-4 max-lg:mx-auto z-[11] cursor-pointer flex items-center gap-2 px-4 py-1 text-base rounded-xl w-fit font-medium font-mono border-white border bg-[#2C2C2C] shadow-[0px_0px_13px_-7px_black]"
            :class="messageType ? 'text-white' : 'text-red-500'" v-if="messageTitle">
            <Icon class="text-2xl" name="material-symbols:close-small-rounded" />
            <span>{{ messageTitle }}</span>
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

/* авторизация */
const userStore = useUserStore()
const { authenticated } = storeToRefs(userStore)
</script>