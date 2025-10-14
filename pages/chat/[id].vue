<template>
    <div class="flex flex-col gap-6">
        <!-- Лоадер при загрузке -->
        <div v-if="isLoading" class="flex flex-col gap-6">
            <div class="animate-pulse">
                <div class="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
                <div class="space-y-4">
                    <div class="h-16 bg-gray-300 rounded"></div>
                    <div class="h-16 bg-gray-300 rounded"></div>
                    <div class="h-16 bg-gray-300 rounded"></div>
                </div>
            </div>
        </div>

        <!-- Основной контент -->
        <div v-else-if="chat" class="flex flex-col gap-6">
            <!-- Заголовок чата -->
            <div class="flex items-center gap-4 p-4 bg-[#2C2C2C] rounded-xl">
                <img :src="getAvatarUrl(otherUser?.avatar_url)" :alt="otherUser?.first_name" class="w-12 h-12 rounded-full object-cover">
                <div class="flex flex-col">
                    <h1 class="text-xl font-semibold text-white">{{ otherUser?.first_name }} {{ otherUser?.last_name }}</h1>
                    <p class="text-sm text-[#A0A0A0]">{{ service?.title }}</p>
                </div>
            </div>

            <!-- Сообщения -->
            <div ref="messagesContainer" class="flex flex-col gap-4 p-4 bg-[#2C2C2C] rounded-xl max-h-[500px] overflow-y-auto">
                <div v-if="messages.length === 0" class="text-center text-[#A0A0A0] py-8">
                    <Icon name="material-symbols:chat-outline" class="text-4xl mx-auto mb-2 opacity-50"/>
                    <p>Пока нет сообщений</p>
                    <p class="text-sm">Начните общение!</p>
                </div>
                
                <div v-for="message in messages" :key="message.id" class="flex" :class="message.sender_id === userId ? 'justify-end' : 'justify-start'">
                    <div class="flex items-end gap-2 max-w-[70%]" :class="message.sender_id === userId ? 'flex-row-reverse' : 'flex-row'">
                        <img v-if="message.sender_id !== userId" :src="getAvatarUrl(otherUser?.avatar_url)" :alt="otherUser?.first_name" class="w-8 h-8 rounded-full object-cover flex-shrink-0">
                        <div class="flex flex-col gap-1" :class="message.sender_id === userId ? 'items-end' : 'items-start'">
                            <div class="px-4 py-2 rounded-2xl max-w-full break-words" 
                                 :class="message.sender_id === userId ? 'bg-sky-500 text-white' : 'bg-[#3C3C3C] text-white'">
                                <p class="text-sm">{{ message.message_text }}</p>
                            </div>
                            <p class="text-xs text-[#A0A0A0] px-2">{{ formatTime(message.created_at) }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Форма отправки сообщения -->
            <form @submit.prevent="sendMessage" class="flex gap-2">
                <input 
                    v-model="newMessage" 
                    type="text" 
                    placeholder="Введите сообщение..." 
                    class="flex-1 px-4 py-2 bg-[#3C3C3C] text-white rounded-xl border border-transparent focus:outline-none focus:border-sky-500 transition-all duration-500"
                    :disabled="isSending"
                >
                <button 
                    type="submit" 
                    :disabled="!newMessage.trim() || isSending"
                    class="px-4 py-2 bg-sky-500 text-white rounded-xl transition-all duration-500 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Icon v-if="isSending" name="material-symbols:progress-activity" class="animate-spin"/>
                    <Icon v-else name="material-symbols:send"/>
                </button>
            </form>
        </div>

        <!-- Ошибка -->
        <div v-else class="text-center text-[#A0A0A0] py-8">
            <Icon name="material-symbols:error-outline" class="text-4xl mx-auto mb-2 text-red-500"/>
            <p>Чат не найден</p>
        </div>
    </div>
</template>

<script setup>
/* SEO */
useSeoMeta({
    title: 'Чат',
    lang: 'ru'
})

/* подключение хранилищ */
const userStore = useUserStore()
const { showMessage } = useMessagesStore()

/* подключение роутера */
const router = useRouter()
const route = useRoute()

/* данные */
const chatId = route.params.id
const userId = userStore.id
const supabase = useSupabaseClient()

/* состояние */
const isLoading = ref(true)
const isSending = ref(false)
const chat = ref(null)
const messages = ref([])
const otherUser = ref(null)
const service = ref(null)
const newMessage = ref('')
const messagesContainer = ref(null)

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

const loadChat = async () => {
    try {
        // Загружаем чат с данными пользователей и услуги
        const { data: chatData, error: chatError } = await supabase
            .from('chats')
            .select(`
                *,
                customer:users!chats_customer_id_fkey(id, first_name, last_name, avatar_url),
                provider:users!chats_provider_id_fkey(id, first_name, last_name, avatar_url),
                service:services(id, title)
            `)
            .eq('id', chatId)
            .single()

        if (chatError) throw chatError
        if (!chatData) throw new Error('Чат не найден')

        // Проверяем, что пользователь является участником чата
        if (chatData.customer_id !== userId && chatData.provider_id !== userId) {
            throw new Error('Нет доступа к этому чату')
        }

        chat.value = chatData
        otherUser.value = chatData.customer_id === userId ? chatData.provider : chatData.customer
        service.value = chatData.service

        // Загружаем сообщения
        await loadMessages()
        
        // Настраиваем real-time подписку
        setupRealtime()
        
    } catch (error) {
        console.error('Ошибка загрузки чата:', error)
        showMessage('Ошибка загрузки чата', false)
    } finally {
        isLoading.value = false
    }
}

const loadMessages = async () => {
    try {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_id', chatId)
            .order('created_at', { ascending: true })

        if (error) throw error
        messages.value = data || []

        // Скролл к последнему сообщению
        nextTick(() => {
            if (messagesContainer.value) {
                messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
            }
        })

        // Отмечаем сообщения как прочитанные
        await markMessagesAsRead()
        
    } catch (error) {
        console.error('Ошибка загрузки сообщений:', error)
    }
}

const markMessagesAsRead = async () => {
    try {
        const { error } = await supabase
            .from('messages')
            .update({ is_read: true })
            .eq('chat_id', chatId)
            .neq('sender_id', userId)

        if (error) throw error
    } catch (error) {
        console.error('Ошибка отметки сообщений как прочитанных:', error)
    }
}

const sendMessage = async () => {
    if (!newMessage.value.trim() || isSending.value) return

    isSending.value = true
    const messageText = newMessage.value.trim()
    newMessage.value = ''

    try {
        const { data, error } = await supabase
            .from('messages')
            .insert({
                chat_id: chatId,
                sender_id: userId,
                message_text: messageText
            })
            .select()
            .single()

        if (error) throw error

        // Сообщение будет добавлено через real-time подписку
        // Не добавляем его вручную, чтобы избежать дублирования

    } catch (error) {
        console.error('Ошибка отправки сообщения:', error)
        showMessage('Ошибка отправки сообщения', false)
        newMessage.value = messageText // Возвращаем текст обратно
    } finally {
        isSending.value = false
    }
}

/* real-time подписка */
let realtimeChannel = null

const setupRealtime = () => {
    if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel)
    }

    realtimeChannel = supabase
        .channel(`chat:${chatId}`)
        .on('postgres_changes', 
            { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'messages',
                filter: `chat_id=eq.${chatId}`
            }, 
            (payload) => {
                console.log('Новое сообщение:', payload.new)
                
                // Проверяем, что сообщение еще не существует в списке
                const messageExists = messages.value.some(msg => msg.id === payload.new.id)
                if (!messageExists) {
                    // Добавляем новое сообщение в список
                    messages.value.push(payload.new)
                    
                    // Скролл к новому сообщению
                    nextTick(() => {
                        if (messagesContainer.value) {
                            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
                        }
                    })
                }

                // Отмечаем как прочитанное, если сообщение не от текущего пользователя
                if (payload.new.sender_id !== userId) {
                    markMessageAsRead(payload.new.id)
                }
            }
        )
        .subscribe()
}

const markMessageAsRead = async (messageId) => {
    try {
        const { error } = await supabase
            .from('messages')
            .update({ is_read: true })
            .eq('id', messageId)

        if (error) throw error
    } catch (error) {
        console.error('Ошибка отметки сообщения как прочитанного:', error)
    }
}

/* инициализация */
onMounted(() => {
    if (!userId) {
        router.push('/auth')
        return
    }
    loadChat()
})

/* очистка при размонтировании */
onUnmounted(() => {
    if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel)
        realtimeChannel = null
    }
})
</script>
