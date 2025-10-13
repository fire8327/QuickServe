<template>
    <div class="flex flex-col gap-6 grow items-center justify-center">
        <FormKit @submit="authUser" type="form" :actions="false" messages-class="hidden"
            form-class="w-full flex flex-col gap-6 items-center justify-center text-[#1C1C1C] py-8 px-4 bg-[#2C2C2C] rounded-xl">
            <p class="mainHeading">Вход</p>
            <div class="flex items-center lg:items-start gap-4 flex-col w-full md:w-2/3 lg:w-1/2">
                <FormKit v-model="user.login" validation="required" messages-class="text-[#E9556D] font-mono"
                    type="text" placeholder="Логин" name="Логин" outer-class="w-full"
                    input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md" />
                <FormKit v-model="user.password" validation="required|length:6"
                    messages-class="text-[#E9556D] font-mono" type="password" placeholder="······" name="Пароль"
                    outer-class="w-full"
                    input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md" />
            </div>
            <button type="submit" :disabled="isAuthDisabled"
                :class="{ 'opacity-50 cursor-not-allowed': isAuthDisabled }"
                class="px-4 py-2 border border-sky-500 bg-sky-500 text-white rounded-full w-[160px] text-center transition-all duration-500 hover:text-sky-500 hover:bg-transparent">
                Вход
            </button>
        </FormKit>
        <div
            class="w-full flex flex-col items-center justify-center gap-6 py-8 px-4 bg-[#2C2C2C] rounded-xl text-center">
            <p class="mainHeading max-w-md">
                Еще нет аккаунта? <span class="text-sky-500">Зарегистрируйтесь</span>
            </p>
            <NuxtLink to="/reg"
                class="mx-auto px-4 py-2 border border-sky-500 text-sky-500 rounded-full w-[160px] text-center transition-all duration-500 hover:text-white hover:bg-sky-500">
                Регистрация
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
/* название и язык страницы */
useSeoMeta({
    title: 'Вход',
    lang: 'ru'
})


/* создание пользователя */
const user = ref({
    login: "",
    password: ""
})


/* подключение хранилищ */
const userStore = useUserStore()


/* подключение роутера */
const router = useRouter()


/* вход */
const isAuthDisabled = ref(false)
const authUser = async() => {  
    isAuthDisabled.value = true

    const result = await userStore.signIn(user.value.login, user.value.password)
    if (result) {
        await router.push('/')
    }
    isAuthDisabled.value = false
} 
</script>