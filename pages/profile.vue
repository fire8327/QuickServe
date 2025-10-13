<template>
    <div class="flex flex-col gap-6">
        <p class="mainHeading">Данные профиля</p>
        <FormKit @submit="saveProfile" type="form" :actions="false" messages-class="hidden" form-class="text-[#1C1C1C] flex flex-col gap-6 items-center justify-center">
            <div class="flex items-center lg:items-start gap-4 max-lg:flex-col w-full md:w-2/3 lg:w-1/2">
                <FormKit v-model="userForm.last_name" validation="required" messages-class="text-[#E9556D] font-mono" type="text" placeholder="Фамилия" name="Фамилия" outer-class="w-full lg:w-1/3" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
                <FormKit v-model="userForm.first_name" validation="required" messages-class="text-[#E9556D] font-mono" type="text" placeholder="Имя" name="Имя" outer-class="w-full lg:w-1/3" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
                <FormKit v-model="userForm.patronymic" messages-class="text-[#E9556D] font-mono" type="text" placeholder="Отчество" name="Отчество" outer-class="w-full lg:w-1/3" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
            </div>
            <FormKit v-model="userForm.phone" validation="required" messages-class="text-[#E9556D] font-mono" type="text" placeholder="Телефон" name="Телефон" outer-class="w-full md:w-2/3 lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
            <div class="relative w-full md:w-2/3 lg:w-1/2 group rounded-xl overflow-hidden" v-if="avatarPreview">
                <img :src="avatarPreview" alt="" class="object-cover object-center aspect-square w-full">
                <button type="button" @click="removeAvatarFile" class="absolute inset-0 bg-black/70 flex items-center justify-center transition-all duration-500 [@media(pointer:coarse)]:opacity-100 [@media(pointer:fine)]:opacity-0 group-hover:opacity-100">
                    <Icon class="text-3xl text-red-500" name="material-symbols:delete-outline"/>
                </button>
            </div>
            <FormKit v-else @change="handleAvatarChange" accept="image/*" messages-class="text-[#E9556D] font-mono" label-class="text-white" file-list-class="text-white" no-files-class="text-white" type="file" label="Аватар" name="Аватар" outer-class="w-full md:w-2/3 lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
            <button :disabled="isLoading" :class="{ 'opacity-50 cursor-not-allowed': isLoading }" type="submit" class="px-4 py-2 border border-sky-500 bg-sky-500 text-white rounded-full w-[160px] text-center transition-all duration-500 hover:text-sky-500 hover:bg-transparent">{{ isLoading ? 'Сохранение...' : 'Сохранить' }}</button>
        </FormKit>
    </div>
    
    <!-- Статистика -->
    <div class="flex flex-col gap-6">
        <p class="mainHeading">Статистика</p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-white rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-yellow-500">{{ averageRating }}</div>
                <div class="text-sm text-gray-600">{{ isProvider ? 'Рейтинг' : 'Строгость' }}</div>
            </div>
            <div class="bg-white rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-blue-500">{{ ordersCount }}</div>
                <div class="text-sm text-gray-600">Заказов</div>
            </div>
            <div class="bg-white rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-green-500">{{ reviewsCount }}</div>
                <div class="text-sm text-gray-600">Отзывов</div>
            </div>
            <div class="bg-white rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-purple-500">{{ daysWithUs }}</div>
                <div class="text-sm text-gray-600">Дней с нами</div>
            </div>
        </div>
    </div>

    <!-- Мои услуги (только для исполнителей) -->
    <div class="flex flex-col gap-6" v-if="userStore.isProvider">
        <div class="flex justify-between items-center">
            <p class="mainHeading">Мои услуги</p>
            <NuxtLink to="/profile/add-service" class="px-4 py-2 border border-sky-500 bg-sky-500 text-white rounded-full text-center transition-all duration-500 hover:text-sky-500 hover:bg-transparent">+ Добавить услугу</NuxtLink>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-[#1C1C1C]" v-if="services && services.length > 0">
            <div class="flex flex-col gap-4 p-4 rounded-xl shadow-lg bg-white" v-for="service in services" :key="service.id">
                <button type="button" @click="deleteService(service.id)" class="cursor-pointer self-end">
                    <Icon class="text-3xl text-red-500" name="material-symbols:delete-outline"/>
                </button>
                <p class="font-semibold">{{ service.title }}</p>
                <p class="line-clamp-2">{{ service.description || 'Описание отсутствует' }}</p>
                <p><span class="font-semibold font-mono">Цена: </span>{{ formatPrice(service.price) }}</p>
                <p><span class="font-semibold font-mono">Категория: </span>{{ service.categories?.name || 'Без категории' }}</p>
            </div>
        </div>
        <div v-else class="flex flex-col w-full items-center gap-4 text-center">
            <Icon name="material-symbols:build" class="text-6xl text-gray-400"/>
            <p class="text-xl text-white font-semibold font-mono">У вас пока нет услуг</p>
            <NuxtLink to="/profile/add-service" class="px-4 py-2 border border-sky-500 bg-sky-500 text-white rounded-full text-center transition-all duration-500 hover:text-sky-500 hover:bg-transparent">Добавить первую услугу</NuxtLink>
        </div>
    </div>

    <!-- Настройки аккаунта -->
    <div class="flex flex-col gap-6">
        <p class="mainHeading">Настройки аккаунта</p>
        <FormKit :form-attrs="{ autocomplete: 'off' }" @submit="updPrivacy" type="form" :actions="false" messages-class="hidden" form-class="text-[#1C1C1C] flex flex-col gap-6 items-center justify-center">
            <div class="flex items-center lg:items-start gap-4 max-lg:flex-col w-full md:w-2/3 lg:w-1/2">
                <FormKit v-model="privacyForm.login" validation="required" messages-class="text-[#E9556D] font-mono" type="text" placeholder="Логин" name="Логин" outer-class="w-full lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
                <FormKit v-model="privacyForm.phone" validation="required" messages-class="text-[#E9556D] font-mono" type="text" placeholder="Телефон" name="Телефон" outer-class="w-full lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
            </div>
            <button :disabled="isLoading" :class="{ 'opacity-50 cursor-not-allowed': isLoading }" type="submit" class="px-4 py-2 border border-sky-500 bg-sky-500 text-white rounded-full w-[160px] text-center transition-all duration-500 hover:text-sky-500 hover:bg-transparent">{{ isLoading ? 'Сохранение...' : 'Обновить' }}</button>
        </FormKit>
    </div>

    <!-- Выход -->
    <div class="flex flex-col gap-6">
        <p class="mainHeading">Выход</p>
        <button @click="logout" class="px-4 py-2 border border-red-500 bg-red-500 text-white rounded-full w-[160px] text-center transition-all duration-500 hover:text-red-500 hover:bg-transparent">Выйти</button>
    </div>
</template>

<script setup>
    /* название и язык страницы */
    useSeoMeta({
        title: 'Профиль',
        lang: 'ru'
    })

    /* проверка роли и создание сообщений */
    const userStore = useUserStore()
    const { id:userId, isProvider, logout } = useUserStore()
    const { showMessage } = useMessagesStore()

    /* подключение БД и роутера */
    const supabase = useSupabaseClient()

    /* загрузка */
    const isLoading = ref(false)

    /* форма пользователя */
    const userForm = ref({
        first_name: '',
        last_name: '',
        patronymic: '',
        phone: '',
        avatar_url: ''
    })

    /* загрузка и аватар */
    const avatarFile = ref(null)
    const avatarPreview = ref('')

    /* форма настроек */
    const privacyForm = ref({
        login: '',
        phone: ''
    })

    /* статистика */
    const averageRating = ref(0)
    const ordersCount = ref(0)
    const reviewsCount = ref(0)
    const daysWithUs = ref(0)

    /* услуги */
    const services = ref([])

    /* загрузка данных профиля */
    const loadProfileData = async () => {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single()

        if (error) throw error

        if (data) {
            userForm.value = {
                first_name: data.first_name || '',
                last_name: data.last_name || '',
                patronymic: data.patronymic || '',
                phone: data.phone || '',
                avatar_url: data.avatar_url || ''
            }
            privacyForm.value = {
                login: data.login || '',
                phone: data.phone || ''
            }
            
            // Показываем текущий аватар
            if (data.avatar_url) {
                avatarPreview.value = getAvatarUrl(data.avatar_url)
            }
        }
    }

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
        userForm.value.avatar_url = ''
    }

    /* сохранение профиля */
    const saveProfile = async () => {
        isLoading.value = true

        try {
            let avatarFileName = userForm.value.avatar_url

            if (avatarFile.value) {
                const file = avatarFile.value
                const extension = file.name.split('.').pop()
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${extension}`

                const { error: uploadError } = await supabase.storage
                    .from('files/avatars')
                    .upload(`${fileName}`, file)

                if (uploadError) throw uploadError

                avatarFileName = fileName
            }

            const { error } = await supabase
                .from('users')
                .update({
                    first_name: userForm.value.first_name,
                    last_name: userForm.value.last_name,
                    patronymic: userForm.value.patronymic,
                    phone: userForm.value.phone,
                    avatar_url: avatarFileName
                })
                .eq('id', userId)

            if (error) throw error

            showMessage('Профиль обновлён!', true)
        } catch (error) {
            showMessage('Ошибка при сохранении: ' + error.message, false)
        } finally {
            isLoading.value = false
        }
    }

    /* обновление настроек */
    const updPrivacy = async () => {
        isLoading.value = true

        try {
            const { error } = await supabase
                .from('users')
                .update({
                    login: privacyForm.value.login,
                    phone: privacyForm.value.phone
                })
                .eq('id', userId)

            if (error) throw error

            showMessage('Данные обновлены!', true)
        } catch (error) {
            showMessage('Ошибка при обновлении: ' + error.message, false)
        } finally {
            isLoading.value = false
        }
    }

    /* загрузка статистики */
    const loadStats = async () => {
        if (isProvider) {
            // Для ИСПОЛНИТЕЛЯ: рейтинг по полученным отзывам
            const { data: ratingData } = await supabase
                .from('reviews')
                .select('rating')
                .eq('services.provider_id', userId)

            if (ratingData && ratingData.length > 0) {
                const avg = ratingData.reduce((sum, r) => sum + r.rating, 0) / ratingData.length
                averageRating.value = Math.round(avg * 10) / 10
            }

            // Заказы, которые он выполнил
            const { count: ordersCountData } = await supabase
                .from('orders')
                .select('*', { count: 'exact', head: true })
                .eq('provider_id', userId)

            ordersCount.value = ordersCountData || 0

            // Отзывы, которые он получил
            const { count: reviewsCountData } = await supabase
                .from('reviews')
                .select('*', { count: 'exact', head: true })
                .eq('services.provider_id', userId)

            reviewsCount.value = reviewsCountData || 0
        } else {
            // Для ЗАКАЗЧИКА: рейтинг по оставленным отзывам
            const { data: ratingData } = await supabase
                .from('reviews')
                .select('rating')
                .eq('user_id', userId)

            if (ratingData && ratingData.length > 0) {
                const avg = ratingData.reduce((sum, r) => sum + r.rating, 0) / ratingData.length
                averageRating.value = Math.round(avg * 10) / 10
            }

            // Заказы, которые он сделал
            const { count: ordersCountData } = await supabase
                .from('orders')
                .select('*', { count: 'exact', head: true })
                .eq('customer_id', userId)

            ordersCount.value = ordersCountData || 0

            // Отзывы, которые он оставил
            const { count: reviewsCountData } = await supabase
                .from('reviews')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId)

            reviewsCount.value = reviewsCountData || 0
        }

        // Дней с нами (для всех)
        const { data: userData } = await supabase
            .from('users')
            .select('created_at')
            .eq('id', userId)
            .single()

        if (userData) {
            const created = new Date(userData.created_at)
            const now = new Date()
            daysWithUs.value = Math.floor((now - created) / (1000 * 60 * 60 * 24))
        }
    }

    /* загрузка услуг */
    const loadServices = async () => {
        if (!isProvider) return

        const { data, error } = await supabase
            .from('services')
            .select(`
                *,
                categories(name)
            `)
            .eq('provider_id', userId)
            .order('created_at', { ascending: false })

        if (error) throw error

        services.value = data || []
    }

    /* удаление услуги */
    const deleteService = async (serviceId) => {
        try {
            const { error } = await supabase
                .from('services')
                .delete()
                .eq('id', serviceId)

            if (error) throw error

            showMessage('Услуга удалена!', true)
            await loadServices()
        } catch (error) {
            showMessage('Ошибка при удалении: ' + error.message, false)
        }
    }

    /* форматирование цены */
    const formatPrice = (price) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0
        }).format(price)
    }

    /* первоначальная загрузка */
    onMounted(async () => {
        await loadProfileData()
        await loadStats()
        await loadServices()
    })
</script>
