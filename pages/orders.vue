<template>
    <div class="flex flex-col gap-8">
        <Loader v-if="isLoading" />
        <template v-else>
            <p class="mainHeading">Мои заказы</p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div v-for="o in orders" :key="o.id" class="bg-white rounded-xl p-4 shadow-md text-[#1C1C1C] flex flex-col gap-3">
                    <div class="flex items-center justify-between">
                        <NuxtLink :to="`/services/${o.service_id}`" class="font-mono font-semibold hover:underline">{{ o.services?.title }}</NuxtLink>
                        <span class="px-2 py-1 rounded-full text-white" :class="statusClass(o.status)">{{ statusText(o.status) }}</span>
                    </div>
                    <div class="text-sm text-gray-600 flex items-center justify-between">
                        <span>Цена: {{ formatPrice(o.services?.price) }}</span>
                        <span>Категория: {{ o.services?.categories?.name }}</span>
                    </div>
                    <div class="flex items-center justify-between text-sm text-gray-600">
                        <div class="flex items-center gap-2">
                            <Icon name="mdi:account" class="text-sky-500" />
                            <span v-if="isProvider">Заказчик: {{ o.customer?.first_name }} {{ o.customer?.last_name }}</span>
                            <span v-else>Исполнитель: {{ o.provider?.first_name }} {{ o.provider?.last_name }}</span>
                        </div>
                        <span class="opacity-70">{{ new Date(o.created_at).toLocaleDateString('ru-RU') }}</span>
                    </div>

                    <div class="flex items-center gap-2 justify-end mt-2">
                        <!-- Заказчик -->
                        <button v-if="!isProvider && o.status === 'in_progress'" @click="finish(o)" class="px-3 py-2 rounded-full bg-green-500 text-white hover:opacity-90">Завершить</button>
                        <button v-if="!isProvider && o.status === 'new'" @click="cancel(o)" class="px-3 py-2 rounded-full bg-red-500 text-white hover:opacity-90">Отменить</button>
                        <!-- Исполнитель -->
                        <button v-if="isProvider && o.status === 'new'" @click="accept(o)" class="px-3 py-2 rounded-full bg-sky-500 text-white hover:opacity-90">Принять</button>
                        <button v-if="isProvider && o.status === 'new'" @click="cancel(o)" class="px-3 py-2 rounded-full bg-red-500 text-white hover:opacity-90">Отказаться</button>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
useSeoMeta({ title: 'Мои заказы', lang: 'ru' })

const supabase = useSupabaseClient()
const { id: userId, isProvider, authenticated } = useUserStore()
const { showMessage } = useMessagesStore()

const isLoading = ref(true)
const orders = ref([])

const statusText = (s) => s === 'new' ? 'Новый' : s === 'in_progress' ? 'В работе' : s === 'done' ? 'Завершён' : 'Отменён'
const statusClass = (s) => ({ 'new': 'bg-amber-500', 'in_progress': 'bg-sky-500', 'done': 'bg-green-500', 'canceled': 'bg-red-500' }[s] || 'bg-gray-400')
const formatPrice = (p) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(p || 0)

const loadOrders = async () => {
    isLoading.value = true
    const base = supabase
        .from('orders')
        .select('*, services(*, categories(name)), customer:customer_id(first_name,last_name), provider:provider_id(first_name,last_name))')
        .order('created_at', { ascending: false })
    const query = isProvider ? base.eq('provider_id', userId) : base.eq('customer_id', userId)
    const { data, error } = await query
    if (!error && data) orders.value = data
    isLoading.value = false
}

const accept = async (o) => {
    const { error } = await supabase
        .from('orders')
        .update({ status: 'in_progress' })
        .eq('id', o.id)
        .eq('provider_id', userId)
        .eq('status', 'new')
    if (error) return showMessage('Ошибка: не удалось принять заказ', false)
    await loadOrders()
}

const finish = async (o) => {
    const { error } = await supabase
        .from('orders')
        .update({ status: 'done' })
        .eq('id', o.id)
        .eq('customer_id', userId)
    if (error) return showMessage('Ошибка: не удалось завершить заказ', false)
    await loadOrders()
}

const cancel = async (o) => {
    const matcher = isProvider ? { provider_id: userId } : { customer_id: userId }
    const { error } = await supabase
        .from('orders')
        .update({ status: 'canceled' })
        .eq('id', o.id)
        .match(matcher)
    if (error) return showMessage(isProvider ? 'Ошибка: не удалось отказаться' : 'Ошибка: не удалось отменить заказ', false)
    await loadOrders()
}

onMounted(async () => {
    if (!authenticated) return navigateTo('/auth')
    await loadOrders()
})
</script>
