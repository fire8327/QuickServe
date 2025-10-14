<template>
    <!-- Услуга + карточка исполнителя -->
    <Loader v-if="isLoading"/>
    <div v-else class="flex flex-col gap-4">
        <NuxtLink to="/services" class="text-sky-500 bg-[#2C2C2C] px-4 py-2 rounded-xl w-fit">Все услуги</NuxtLink>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <!-- Услуга -->
            <div class="w-full bg-[#2C2C2C] rounded-xl p-4 text-[#1C1C1C]">
                <div class="flex flex-col gap-4 bg-white rounded-xl p-4 shadow-md">
                    <div class="flex items-center justify-between">
                        <p class="text-2xl font-mono font-semibold">{{ service?.title }}</p>
                        <span class="font-medium text-sky-500">{{ formatPrice(service?.price) }}</span>
                    </div>
                    <div class="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div>Категория: {{ service?.categories?.name || 'Без категории' }}</div>
                    </div>
                    <div v-if="imageUrl" class="rounded-xl overflow-hidden">
                        <img :src="imageUrl" alt="" class="w-full aspect-video object-cover object-center">
                    </div>
                    <div>
                        <p class="text-gray-800 whitespace-pre-line">{{ service?.description || 'Описание отсутствует' }}</p>
                    </div>
                    <div class="flex items-center justify-end gap-3">
                        <button v-if="canOrder" @click="createOrder" class="px-4 py-2 rounded-full bg-sky-500 text-white transition-all duration-300 hover:opacity-80">Заказать</button>
                    </div>
                </div>
            </div>
    
            <!-- Исполнитель -->
            <div class="w-full bg-[#2C2C2C] rounded-xl p-4">
                <div class="bg-white rounded-xl p-4 shadow-md flex flex-col gap-4">
                    <p class="text-lg font-mono font-semibold">Исполнитель</p>
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                            <img v-if="providerAvatarUrl" :src="providerAvatarUrl" alt="" class="w-full h-full object-cover">
                            <Icon v-else name="mdi:account" class="text-2xl text-sky-500" />
                        </div>
                        <div class="flex flex-col">
                            <span class="text-gray-800">{{ providerName }}</span>
                            <div class="flex items-center gap-1 text-sm text-gray-600">
                                <Icon name="mdi:star" class="text-amber-500" />
                                <span>{{ providerAvgRating || 0 }}</span>
                                <span class="opacity-60">({{ providerReviewsCount }})</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Отзывы -->
    <div v-if="!isLoading" class="flex flex-col gap-4 w-full">
        <p class="mainHeading">Отзывы</p>
        <div class="bg-[#2C2C2C] rounded-xl p-4">
            <div v-if="reviews && reviews.length > 0" class="flex flex-col gap-4">
                <div v-for="rev in reviews" :key="rev.id" class="bg-white rounded-xl p-4 shadow-md">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <Icon name="mdi:account" class="text-xl text-sky-500" />
                            <span class="text-sm text-gray-700">{{ rev.users?.first_name }} {{ rev.users?.last_name }}</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <Icon name="mdi:star" class="text-amber-500" />
                            <span class="text-sm text-gray-700">{{ rev.rating }}</span>
                        </div>
                    </div>
                    <p class="mt-2 text-gray-800">{{ rev.text || 'Без комментария' }}</p>
                </div>
            </div>
            <div v-else class="text-center text-white opacity-70 py-6">Пока нет отзывов</div>
        </div>

        <!-- Добавить отзыв -->
        <div v-if="canReview" class="bg-[#2C2C2C] rounded-xl p-4">
            <FormKit @submit="submitReview" type="form" :actions="false" messages-class="hidden" form-class="flex flex-col gap-4 text-[#1C1C1C]">
                <div class="bg-white rounded-xl p-4 shadow-md flex flex-col gap-4">
                    <div class="flex items-center gap-4">
                        <FormKit type="number" min="1" max="5" v-model.number="reviewForm.rating" validation="required|number" name="Оценка" placeholder="Оценка (1-5)" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
                    </div>
                    <FormKit type="textarea" rows="4" v-model="reviewForm.text" name="Комментарий" placeholder="Комментарий" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
                    <div class="flex justify-end">
                        <button type="submit" class="px-4 py-2 rounded-full bg-sky-500 text-white transition-all duration-300 hover:opacity-80">Оставить отзыв</button>
                    </div>
                </div>
            </FormKit>
        </div>
    </div>
</template>

<script setup>
useSeoMeta({ title: 'Услуга', lang: 'ру' })

/* роутер, бд, сторы */
const route = useRoute()
const router = useRouter()
const supabase = useSupabaseClient()
const { id: userId, authenticated, isProvider } = useUserStore()
const { showMessage } = useMessagesStore()

/* загрузка */
const isLoading = ref(true)

/* состояние страницы */
const service = ref(null)
const imageUrl = ref('')
const providerAvatarUrl = ref('')

/* имя исполнителя */
const providerName = computed(() => {
    if (!service.value || !service.value.users) return ''
    const u = service.value.users
    return [u.first_name, u.last_name].filter(Boolean).join(' ')
})

/* отзывы и рейтинги */
const reviews = ref([])
const averageRating = ref(0)
const providerAvgRating = ref(0)
const providerReviewsCount = ref(0)

/* форма отзыва и право оставлять его */
const reviewForm = ref({ rating: 5, text: '' })
const canReview = ref(false)

/* можно ли оформить заказ (только заказчик и не владелец услуги) */
const canOrder = computed(() => {
    const ownerId = service.value?.provider_id
    if (!authenticated) return true
    return !isProvider && userId !== ownerId
})

/* форматирование цены */
const formatPrice = (price) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(price || 0)

/* загрузка услуги + публичные URL изображений */
const loadService = async () => {
    const id = Number(route.params.id)
    const { data, error } = await supabase
        .from('services')
        .select(`*, categories(name), users:provider_id (id, first_name, last_name, phone, avatar_url) `)
        .eq('id', id)
        .single()
    if (error) throw error
    service.value = data
    if (data?.image_url) {
        const { data: pub } = supabase.storage.from('files').getPublicUrl(`services/${data.image_url}`)
        imageUrl.value = pub.publicUrl
    }
    if (data?.users?.avatar_url) {
        const { data: apub } = supabase.storage.from('files').getPublicUrl(`avatars/${data.users.avatar_url}`)
        providerAvatarUrl.value = apub.publicUrl
    }
}

/* загрузка отзывов по услуге + средняя оценка услуги */
const loadReviews = async () => {
    const id = Number(route.params.id)
    const { data, error } = await supabase
        .from('reviews')
        .select('id, rating, text, created_at, users:user_id (first_name, last_name)')
        .eq('service_id', id)
        .order('created_at', { ascending: false })
    if (!error && data) {
        reviews.value = data
        if (data.length) {
            const avg = data.reduce((s, r) => s + (r.rating || 0), 0) / data.length
            averageRating.value = Math.round(avg * 10) / 10
        } else {
            averageRating.value = 0
        }
    }
}

/* загрузка среднего рейтинга исполнителя по всем его услугам */
const loadProviderRating = async () => {
    const providerId = service.value?.provider_id
    if (!providerId) return
    const { data, error } = await supabase
        .from('reviews')
        .select('rating, services!inner(provider_id)')
        .eq('services.provider_id', providerId)
    if (!error && data) {
        providerReviewsCount.value = data.length
        if (data.length) {
            const avg = data.reduce((s, r) => s + (r.rating || 0), 0) / data.length
            providerAvgRating.value = Math.round(avg * 10) / 10
        } else {
            providerAvgRating.value = 0
        }
    }
}

/* проверяем, может ли пользователь оставить отзыв (есть завершенный заказ) */
const checkCanReview = async () => {
    if (!authenticated) { canReview.value = false; return }
    const id = Number(route.params.id)
    const { data, error } = await supabase
        .from('orders')
        .select('id')
        .eq('service_id', id)
        .eq('customer_id', userId)
        .eq('status', 'done')
        .maybeSingle()
    canReview.value = !!data && !error
}

/* отправка отзыва */
const submitReview = async () => {
    if (!authenticated) {
        showMessage('Войдите, чтобы оставить отзыв', false)
        return router.push('/auth')
    }
    const id = Number(route.params.id)
    const { data: exists } = await supabase
        .from('reviews')
        .select('id')
        .eq('service_id', id)
        .eq('user_id', userId)
        .maybeSingle()
    if (exists) {
        return showMessage('Вы уже оставили отзыв на эту услугу', false)
    }

    const { error } = await supabase
        .from('reviews')
        .insert({
            service_id: id,
            user_id: userId,
            rating: reviewForm.value.rating,
            text: reviewForm.value.text || null
        })
    if (error) return showMessage('Ошибка при добавлении отзыва', false)
    showMessage('Отзыв добавлен!', true)
    reviewForm.value = { rating: 5, text: '' }
    await loadReviews()
    await loadProviderRating()
}

/* создание заказа (только для заказчика и не для своей услуги) */
const createOrder = async () => {
    if (!canOrder) return
    if (!authenticated) {
        showMessage('Войдите, чтобы оформить заказ', false)
        return router.push('/auth')
    }
    const id = Number(route.params.id)
    const providerId = service.value?.provider_id
    if (!providerId) return

    const { error } = await supabase
        .from('orders')
        .insert({ service_id: id, customer_id: userId, provider_id: providerId, status: 'new' })
    if (error) return showMessage('Ошибка создания заказа', false)
    showMessage('Заказ создан!', true)
}

onMounted(async () => {
    try {
        await loadService()
        await loadReviews()
        await loadProviderRating()
        await checkCanReview()
    } finally {
        isLoading.value = false
    }
})
</script>
