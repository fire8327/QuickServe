<template>
    <div class="flex flex-col gap-6 grow items-center justify-center">
        <FormKit @submit="regUser" type="form" :actions="false" messages-class="hidden" form-class="w-full flex flex-col gap-6 items-center justify-center text-[#1C1C1C] py-8 px-4 bg-[#2C2C2C] rounded-xl">
            <p class="mainHeading">Регистрация</p>
            <div class="flex items-center lg:items-start gap-4 max-lg:flex-col w-full md:w-2/3 lg:w-1/2">
                <FormKit v-model="user.first_name" validation="required" messages-class="text-[#E9556D] font-mono" type="text" placeholder="Имя" name="Имя" outer-class="w-full lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
                <FormKit v-model="user.last_name" validation="required" messages-class="text-[#E9556D] font-mono" type="text" placeholder="Фамилия" name="Фамилия" outer-class="w-full lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
            </div>
            <FormKit v-model="user.patronymic" messages-class="text-[#E9556D] font-mono" type="text" placeholder="Отчество" name="Отчество" outer-class="w-full md:w-2/3 lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
            <FormKit v-model="user.phone" validation="required" messages-class="text-[#E9556D] font-mono" type="text" placeholder="Телефон" name="Телефон" outer-class="w-full md:w-2/3 lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
            <div class="relative w-full md:w-2/3 lg:w-1/2 group rounded-xl overflow-hidden" v-if="avatarPreview">
                <img :src="avatarPreview" alt="" class="object-cover object-center aspect-square w-full">
                <button type="button" @click="removeAvatarFile" class="absolute inset-0 bg-black/70 flex items-center justify-center transition-all duration-500 [@media(pointer:coarse)]:opacity-100 [@media(pointer:fine)]:opacity-0 group-hover:opacity-100">
                    <Icon class="text-3xl text-red-500" name="material-symbols:delete-outline"/>
                </button>
            </div>
            <FormKit v-else @change="handleAvatarChange" accept="image/*" validation="required" messages-class="text-[#E9556D] font-mono" label-class="text-white" file-list-class="text-white" no-files-class="text-white" type="file" label="Аватар" name="Аватар" outer-class="w-full md:w-2/3 lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
            <div class="flex max-md:flex-col items-center w-full md:w-2/3 lg:w-1/2 gap-4">
                <div @click="user.is_provider = false" class="cursor-pointer flex items-center gap-2 p-4 rounded-lg transition-all duration-500 w-full md:w-1/2 border shadow-md" :class="[!user.is_provider ? 'border-sky-500 bg-[#000000]/15' : 'bg-[#3C3C3C] border-white/10 hover:opacity-50']">
                    <Icon class="text-3xl text-sky-500" name="ic:baseline-man"/>
                    <div class="flex flex-col gap-1">
                        <p class="font-semibold text-white">Заказчик</p>
                        <p class="text-sm text-[#A0A0A0]">Заказываю услуги</p>
                    </div>
                </div>
                <div @click="user.is_provider = true" class="cursor-pointer flex items-center gap-2 p-4 rounded-lg transition-all duration-500 w-full md:w-1/2 border shadow-md" :class="[user.is_provider ? 'border-sky-500 bg-[#000000]/15' : 'bg-[#3C3C3C] border-white/10 hover:opacity-50']">
                    <Icon class="text-3xl text-sky-500" name="material-symbols:build"/>
                    <div class="flex flex-col gap-1">
                        <p class="font-semibold text-white">Исполнитель</p>
                        <p class="text-sm text-[#A0A0A0]">Предоставляю услуги</p>
                    </div>
                </div>
            </div>
            <div class="flex items-center lg:items-start gap-4 max-lg:flex-col w-full md:w-2/3 lg:w-1/2">
                <FormKit v-model="user.login" validation="required" messages-class="text-[#E9556D] font-mono" type="text" placeholder="Логин" name="Логин" outer-class="w-full lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
                <FormKit v-model="user.password" validation="required|length:6" messages-class="text-[#E9556D] font-mono" type="password" placeholder="······" name="Пароль" outer-class="w-full lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
            </div>
            <button :disabled="isRegDisabled" :class="{ 'opacity-50 cursor-not-allowed': isRegDisabled }" type="submit" class="px-4 py-2 border border-sky-500 bg-sky-500 text-white rounded-full w-[160px] text-center transition-all duration-500 hover:text-sky-500 hover:bg-transparent">Регистрация</button>
        </FormKit>
        <div class="w-full flex flex-col items-center justify-center gap-6 py-8 px-4 bg-[#2C2C2C] rounded-xl text-center">
            <p class="mainHeading max-w-md">Если у вас уже есть аккаунт, <span class="text-sky-500">войдите</span> в систему</p>
            <NuxtLink to="/auth" class="mx-auto px-4 py-2 border border-sky-500 text-sky-500 rounded-full w-[160px] text-center transition-all duration-500 hover:text-white hover:bg-sky-500">Вход</NuxtLink>
        </div>
    </div>
</template>

<script setup>
/* название и язык страницы */
useSeoMeta({
    title: 'Регистрация',
    lang: 'ru'
})


/* создание пользователя */
const user = ref({
    first_name: "",
    last_name: "",
    patronymic: "",
    phone: "",
    login: "",
    password: "",
    is_provider: false,
    avatar_url: ""
})

/* загрузка и аватар */
const avatarFile = ref(null)
const avatarPreview = ref('')


/* подключение БД и роутера */
const userStore = useUserStore()
const router = useRouter()
const supabase = useSupabaseClient()
const { showMessage } = useMessagesStore()


/* получение аватара */
const getAvatarUrl = (fileName) => {
    const { data } = supabase.storage.from('files/avatars').getPublicUrl(fileName)
    return data.publicUrl
}

/* обработка выбора аватара */
const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
        avatarFile.value = file
        const reader = new FileReader()
        reader.onload = (e) => {
            avatarPreview.value = e.target.result
        }
        reader.readAsDataURL(file)
    }
}

/* удаление аватара */
const removeAvatarFile = () => {
    avatarFile.value = null
    avatarPreview.value = ''
    user.value.avatar_url = ''
}

/* регистрация пользователя */
const isRegDisabled = ref(false)
const regUser = async () => {
    isRegDisabled.value = true

    try {
        let avatarFileName = user.value.avatar_url

        if (avatarFile.value) {
            const file = avatarFile.value
            const extension = file.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${extension}`

            const { error: uploadError } = await supabase.storage
                .from('files/avatars')
                .upload(`${fileName}`, file)

            if (uploadError) throw uploadError

            avatarFileName = fileName
            user.value.avatar_url = fileName
        }

        const userData = { ...user.value, avatar_url: avatarFileName }
        const result = await userStore.signUp(userData)
        if (result) {
            await router.push('/')
        }
    } catch (error) {
        showMessage('Ошибка при загрузке аватара: ' + error.message, false)
    } finally {
        isRegDisabled.value = false
    }
}
</script>