<template>
    <div class="flex flex-col gap-6">
        <!-- Лоадер при загрузке -->
        <div v-if="isLoading" class="flex flex-col gap-6">
            <div class="animate-pulse">
                <div class="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
                <div class="space-y-4">
                    <div class="h-20 bg-gray-300 rounded"></div>
                    <div class="h-20 bg-gray-300 rounded"></div>
                    <div class="h-20 bg-gray-300 rounded"></div>
                </div>
            </div>
        </div>

        <!-- Основной контент -->
        <div v-else class="flex flex-col gap-6">
            <h1 class="mainHeading">Мои чаты</h1>

            <!-- Список чатов -->
            <div v-if="chats.length > 0" class="flex flex-col gap-4">
                <div 
                    v-for="chat in chats" 
                    :key="chat.id" 
                    @click="goToChat(chat.id)"
                    class="flex items-center gap-4 p-4 bg-[#2C2C2C] rounded-xl cursor-pointer transition-all duration-500 hover:bg-[#3C3C3C] hover:shadow-lg"
                >
                    <!-- Аватар собеседника -->
                    <img 
                        :src="getAvatarUrl(getOtherUser(chat)?.avatar_url)" 
                        :alt="getOtherUser(chat)?.first_name" 
                        class="w-16 h-16 rounded-full object-cover flex-shrink-0"
                    >
                    
                    <!-- Информация о чате -->
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between mb-1">
                            <h3 class="text-lg font-semibold text-white truncate">
                                {{ getOtherUser(chat)?.first_name }} {{ getOtherUser(chat)?.last_name }}
                            </h3>
                            <span class="text-sm text-[#A0A0A0] flex-shrink-0 ml-2">
                                {{ formatTime(chat.updated_at) }}
                            </span>
                        </div>
                        
                        <p class="text-sm text-[#A0A0A0] mb-2 truncate">
                            {{ chat.service?.title }}
                        </p>
                        
                        <!-- Последнее сообщение -->
                        <div class="flex items-center justify-between">
                            <p class="text-sm text-white truncate flex-1">
                                {{ getLastMessage(chat) }}
                            </p>
                            
                            <!-- Индикатор непрочитанных сообщений -->
                            <div v-if="getUnreadCount(chat) > 0" class="bg-sky-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 ml-2">
                                {{ getUnreadCount(chat) > 99 ? '99+' : getUnreadCount(chat) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Пустое состояние -->
            <div v-else class="text-center text-[#A0A0A0] py-12">
                <Icon name="material-symbols:chat-outline" class="text-6xl mx-auto mb-4 opacity-50"/>
                <h2 class="text-xl font-semibold mb-2">Пока нет чатов</h2>
                <p class="mb-6">Начните общение с исполнителями или заказчиками</p>
                <NuxtLink to="/services" class="px-6 py-3 bg-sky-500 text-white rounded-full transition-all duration-500 hover:bg-sky-600">
                    Найти услуги
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
/* SEO */
useSeoMeta({
    title: 'Чаты',
    lang: 'ru'
})

/* подключение хранилищ */
const userStore = useUserStore()

/* подключение роутера */
const router = useRouter()

/* данные */
const userId = userStore.id
const supabase = useSupabaseClient()

/* состояние */
const isLoading = ref(true)
const chats = ref([])

/* функции */
const getAvatarUrl = (fileName) => {
    if (!fileName) return '/images/default-avatar.png'
    const { data } = supabase.storage.from('files').getPublicUrl(`avatars/${fileName}`)
    return data.publicUrl
}

const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    
    if (diff < 60000) return 'только что'
    if (diff < 3600000) return `${Math.floor(diff / 60000)} мин назад`
    if (diff < 86400000) return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
}

const getOtherUser = (chat) => {
    return chat.customer_id === userId ? chat.provider : chat.customer
}

const getLastMessage = (chat) => {
    if (!chat.last_message) return 'Нет сообщений'
    return chat.last_message.message_text
}

const getUnreadCount = (chat) => {
    return chat.unread_count || 0
}

const goToChat = (chatId) => {
    router.push(`/chat/${chatId}`)
}

const loadChats = async () => {
    try {
        // Загружаем чаты пользователя с последними сообщениями
        const { data, error } = await supabase
            .from('chats')
            .select(`
                *,
                customer:users!chats_customer_id_fkey(id, first_name, last_name, avatar_url),
                provider:users!chats_provider_id_fkey(id, first_name, last_name, avatar_url),
                service:services(id, title),
                last_message:messages(
                    message_text,
                    created_at
                ),
                unread_count:messages(
                    id
                )
            `)
            .or(`customer_id.eq.${userId},provider_id.eq.${userId}`)
            .order('updated_at', { ascending: false })

        if (error) throw error

        // Обрабатываем данные
        chats.value = (data || []).map(chat => {
            // Получаем последнее сообщение
            const lastMessage = chat.last_message && chat.last_message.length > 0 
                ? chat.last_message[chat.last_message.length - 1] 
                : null

            // Считаем непрочитанные сообщения (от другого пользователя)
            const unreadCount = chat.unread_count ? 
                chat.unread_count.filter(msg => msg.sender_id !== userId).length : 0

            return {
                ...chat,
                last_message: lastMessage,
                unread_count: unreadCount
            }
        })
        
    } catch (error) {
        console.error('Ошибка загрузки чатов:', error)
    } finally {
        isLoading.value = false
    }
}

/* real-time подписка */
let realtimeChannel = null

const setupRealtime = () => {
    if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel)
    }

    realtimeChannel = supabase
        .channel('chats-updates')
        .on('postgres_changes', 
            { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'messages'
            }, 
            (payload) => {
                console.log('Новое сообщение в чате:', payload.new)
                // Обновляем список чатов при получении нового сообщения
                loadChats()
            }
        )
        .subscribe()
}

/* инициализация */
onMounted(() => {
    if (!userId) {
        router.push('/auth')
        return
    }
    loadChats()
    setupRealtime()
})

/* очистка при размонтировании */
onUnmounted(() => {
    if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel)
        realtimeChannel = null
    }
})
</script>
