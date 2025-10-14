<template>
    <div class="flex flex-col gap-8">
        <Loader v-if="isLoading" />
        <template v-else>
            <!-- Поиск и фильтры -->
            <div class="bg-[#2C2C2C] rounded-xl p-4 text-[#1A1A1A] ">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input v-model.trim="filters.query" type="text" placeholder="Название услуги" class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
                    <select v-model.number="filters.categoryId" class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md">
                        <option :value="0">Все категории</option>
                        <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
                    </select>
                    <select v-model.number="filters.minRating" class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md">
                        <option :value="0">Любой рейтинг</option>
                        <option :value="4">4.0+ ★</option>
                        <option :value="3">3.0+ ★</option>
                        <option :value="2">2.0+ ★</option>
                        <option :value="1">1.0+ ★</option>
                    </select>
                    <select v-model="filters.priceRange" class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md">
                        <option value="any">Любая цена</option>
                        <option value="lt1k">До 1 000 ₽</option>
                        <option value="1k5k">1 000–5 000 ₽</option>
                        <option value="5k20k">5 000–20 000 ₽</option>
                        <option value="gt20k">Более 20 000 ₽</option>
                    </select>
                </div>
            </div>

            <!-- Количество -->
            <div class="text-white text-lg font-mono">Найдено услуг: {{ filteredServices.length }}</div>

            <!-- Список услуг -->
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <div v-for="svc in filteredServices" :key="svc.id" class="bg-white rounded-xl p-4 shadow-md flex flex-col gap-4">
                    <div class="flex items-start justify-between">
                        <div class="flex items-center gap-2">
                            <Icon name="mdi:cog" class="text-sky-500" />
                            <NuxtLink :to="`/services/${svc.id}`" class="font-mono font-semibold hover:underline">{{ svc.title }}</NuxtLink>
                        </div>
                        <div class="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 rounded-lg px-2 py-1">
                            <Icon name="mdi:star" />
                            <span>{{ svc.avgRating || 0 }}</span>
                        </div>
                    </div>
                    <p class="text-gray-600 line-clamp-2">{{ svc.description }}</p>
                    <div v-if="svc._imageUrl" class="rounded-lg overflow-hidden bg-gray-100">
                        <img :src="svc._imageUrl" alt="" class="w-full h-40 object-cover object-center">
                    </div>
                    <div class="flex items-center justify-between text-sm text-gray-600">
                        <div class="flex items-center gap-2">
                            <div class="w-6 h-6 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                <img v-if="svc._providerAvatar" :src="svc._providerAvatar" alt="" class="w-full h-full object-cover">
                                <Icon v-else name="mdi:account" class="text-sky-500 text-base" />
                            </div>
                            <span>{{ svc._providerName }}</span>
                        </div>
                        <span class="px-2 py-1 rounded-lg bg-gray-100">{{ svc.categories?.name }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-sky-600 font-semibold">{{ formatPrice(svc.price) }}</span>
                        <div class="flex items-center gap-2">
                            <NuxtLink :to="`/services/${svc.id}`" class="px-3 py-2 rounded-full border border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white transition-all">Подробнее</NuxtLink>
                            <button v-if="canOrderFor(svc)" @click="createOrder(svc)" class="px-3 py-2 rounded-full bg-sky-500 text-white hover:opacity-90 transition-all">Заказать</button>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
useSeoMeta({ title: 'Услуги', lang: 'ru' })

/* базовые зависимости */
const supabase = useSupabaseClient()
const { id: userId, authenticated, isProvider } = useUserStore()
const { showMessage } = useMessagesStore()

/* загрузка */
const isLoading = ref(true)

/* фильтры и данные */
const filters = reactive({ query: '', categoryId: 0, minRating: 0, priceRange: 'any' })
const categories = ref([])
const services = ref([])

/* формат цены */
const formatPrice = (price) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(price || 0)

/* диапазоны цен */
const getPriceBounds = () => {
    switch (filters.priceRange) {
        case 'lt1k': return { max: 1000 }
        case '1k5k': return { min: 1000, max: 5000 }
        case '5k20k': return { min: 5000, max: 20000 }
        case 'gt20k': return { min: 20000 }
        default: return {}
    }
}

/* можно ли оформить заказ по карточке */
const canOrderFor = (svc) => {
    if (!authenticated) return true
    return !isProvider && userId !== svc.provider_id
}

/* загрузка категорий */
const loadCategories = async () => {
    const { data, error } = await supabase.from('categories').select('*').order('name')
    if (!error && data) categories.value = data
}

/* загрузка услуг с учетом серверных фильтров по тексту/категории/цене */
const loadServices = async () => {
    isLoading.value = true
    let query = supabase
        .from('services')
        .select('*, categories(name), users:provider_id(id, first_name, last_name, avatar_url)')
        .order('created_at', { ascending: false })

    if (filters.query) query = query.ilike('title', `%${filters.query}%`)
    if (filters.categoryId) query = query.eq('category_id', filters.categoryId)
    const bounds = getPriceBounds()
    if (bounds.min != null) query = query.gte('price', bounds.min)
    if (bounds.max != null) query = query.lte('price', bounds.max)

    const { data, error } = await query
    if (error) {
        console.error(error)
        isLoading.value = false
        return
    }

    // подготовка карточек + публичные URL
    const prepared = (data || []).map(it => {
        const name = [it.users?.first_name, it.users?.last_name].filter(Boolean).join(' ')
        const avatarFile = it.users?.avatar_url
        const imgFile = it.image_url
        const { data: aPub } = avatarFile ? supabase.storage.from('files').getPublicUrl(`avatars/${avatarFile}`) : { data: null }
        const { data: iPub } = imgFile ? supabase.storage.from('files').getPublicUrl(`services/${imgFile}`) : { data: null }
        return { ...it, _providerName: name, _providerAvatar: aPub?.publicUrl || '', _imageUrl: iPub?.publicUrl || '' }
    })

    // посчитать средний рейтинг по услугам (клиентская агрегация)
    const ids = prepared.map(s => s.id)
    if (ids.length === 0) { services.value = prepared; isLoading.value = false; return }
    const { data: revs } = await supabase.from('reviews').select('service_id,rating').in('service_id', ids)
    const ratingMap = new Map()
    ;(revs || []).forEach(r => {
        const current = ratingMap.get(r.service_id) || { sum: 0, count: 0 }
        current.sum += r.rating || 0
        current.count += 1
        ratingMap.set(r.service_id, current)
    })
    services.value = prepared.map(s => {
        const stat = ratingMap.get(s.id)
        const avg = stat && stat.count ? Math.round((stat.sum / stat.count) * 10) / 10 : 0
        return { ...s, avgRating: avg }
    })
    isLoading.value = false
}

/* итоговая фильтрация по рейтингу */
const filteredServices = computed(() => {
    if (!filters.minRating) return services.value
    return services.value.filter(s => (s.avgRating || 0) >= filters.minRating)
})

/* создание заказа из списка */
const createOrder = async (svc) => {
    if (!canOrderFor(svc)) return
    if (!authenticated) {
        showMessage('Войдите, чтобы оформить заказ', false)
        return navigateTo('/auth')
    }
    const { error } = await supabase
        .from('orders')
        .insert({ service_id: svc.id, customer_id: userId, provider_id: svc.provider_id, status: 'new' })
    if (error) return showMessage('Ошибка создания заказа', false)
    showMessage('Заказ создан!', true)
}

/* дебаунс перезагрузки при изменении фильтров */
let debounceId = null
const scheduleLoad = () => {
    if (debounceId) clearTimeout(debounceId)
    debounceId = setTimeout(() => {
        loadServices()
    }, 400)
}

/* реактивная подгрузка при изменении фильтров */
watch(() => ({ ...filters }), () => {
    scheduleLoad()
}, { deep: true })

onMounted(async () => {
    await loadCategories()
    await loadServices()
})
</script>
