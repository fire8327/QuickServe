<template>
    <FormKit @submit="regUser" type="form" :actions="false" messages-class="hidden" form-class="flex flex-col gap-6 items-center justify-center grow">
        <p class="mainHeading">Регистрация</p>
        <div class="flex items-center lg:items-start gap-4 max-lg:flex-col w-full md:w-2/3 lg:w-1/2">
            <FormKit v-model="user.login" validation="required" messages-class="text-[#E9556D] font-mono" type="text" placeholder="Логин" name="Логин" outer-class="w-full lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
            <FormKit v-model="user.password" validation="required|length:6" messages-class="text-[#E9556D] font-mono" type="password" placeholder="······" name="Пароль" outer-class="w-full lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
        </div>
        <FormKit v-model="user.email" validation="required|email" messages-class="text-[#E9556D] font-mono" type="text" placeholder="Email" name="Email" outer-class="w-full md:w-2/3 lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
        <div class="flex max-md:flex-col items-center w-full md:w-2/3 lg:w-1/2 gap-4">
            <div @click="user.role = 'applicant'" class="cursor-pointer flex items-center gap-2 p-4 rounded-lg transition-all duration-500 w-full md:w-1/2 border shadow-md" :class="[user.role === 'applicant' ? 'border-sky-500 bg-[#000000]/15' : 'bg-[#3C3C3C] border-white/10 hover:opacity-50']">
                <Icon class="text-3xl text-sky-500" name="ic:baseline-man"/>
                <div class="flex flex-col gap-1">
                    <p class="font-semibold text-white">Соискатель</p>
                    <p class="text-sm">Ищу работу</p>
                </div>
            </div>
            <div @click="user.role = 'employer'" class="cursor-pointer flex items-center gap-2 p-4 rounded-lg transition-all duration-500 w-full md:w-1/2 border shadow-md" :class="[user.role === 'employer' ? 'border-sky-500 bg-[#000000]/15' : 'bg-[#3C3C3C] border-white/10 hover:opacity-50']">
                <Icon class="text-3xl text-sky-500" name="hugeicons:permanent-job"/>
                <div class="flex flex-col gap-1">
                    <p class="font-semibold text-white">Работодатель</p>
                    <p class="text-sm">Ищу сотрудников</p>
                </div>
            </div>
        </div>
        <button :disabled="isRegDisabled" :class="{ 'opacity-50 cursor-not-allowed': isRegDisabled }" type="submit" class="px-4 py-2 border border-sky-500 bg-sky-500 text-white rounded-full w-[160px] text-center transition-all duration-500 hover:text-sky-500 hover:bg-transparent">Регистрация</button>
        <div class="flex items-center justify-center gap-4 w-full md:w-2/3 lg:w-1/2 my-10">
            <div class="w-1/3 h-px bg-sky-500"></div>  
            <p class="font-semibold font-mono tracking-widest text-sky-500">или</p>
            <div class="w-1/3 h-px bg-sky-500"></div>  
        </div>
        <NuxtLink to="/auth" class="mx-auto px-4 py-2 border border-sky-500 text-sky-500 rounded-full w-[160px] text-center transition-all duration-500 hover:text-white hover:bg-sky-500">Вход</NuxtLink>
    </FormKit>
</template>

<script setup>
/* название и язык страницы */
useSeoMeta({
    title: 'Регистрация',
    lang: 'ru'
})


/* создание пользователя */
const user = ref({
    login: "",
    password: "",
    email: "",
    role: "applicant"
})


/* создание сообщений */
const { showMessage } = useMessagesStore()


/* подключение БД и роутера */
const supabase = useSupabaseClient()
const router = useRouter()


/* регистрация пользователя */
const isRegDisabled = ref(false)
const regUser = async () => {
    isRegDisabled.value = true
    const { data: users, error: usersError } = await supabase
    .from('users')
    .select("*")
    .eq('login', user.value.login)

    if (users[0]) {
        user.value.login = ""
        isRegDisabled.value = false
        return showMessage("Такой  логин уже используется!", false)
    } 
    

    const { data, error } = await supabase
    .from('users')
    .insert(user.value)
    .select()

    if (data) {
        console.log(data)
        showMessage('Успешная регистрация!', true)
        isRegDisabled.value = false
        router.push('/auth')
    } else {
        console.log(user.value)            
        isRegDisabled.value = false
        showMessage('Произошла ошибка!', false)
    }
}
</script>