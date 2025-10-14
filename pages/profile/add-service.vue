<template>
    <div class="flex flex-col gap-6 grow items-center justify-center">
        <FormKit @submit="create" type="form" :actions="false" messages-class="hidden" form-class="w-full flex flex-col gap-6 items-center justify-center text-[#1C1C1C] py-8 px-4 bg-[#2C2C2C] rounded-xl">
            <p class="mainHeading">Добавить услугу</p>

            <div class="flex items-center lg:items-start gap-4 max-lg:flex-col w-full md:w-2/3 lg:w-1/2">
                <FormKit v-model="form.title" validation="required" messages-class="text-[#E9556D] font-mono" type="text" placeholder="Название услуги" name="Название" outer-class="w-full" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
            </div>

            <div class="flex items-center lg:items-start gap-4 max-lg:flex-col w-full md:w-2/3 lg:w-1/2">
                <FormKit type="select" v-model="form.category_id" validation="required" messages-class="text-[#E9556D] font-mono" name="Категория" :options="categoryOptions" outer-class="w-full" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
            </div>

            <div class="flex gap-4 flex-col w-full md:w-2/3 lg:w-1/2">
                <FormKit type="number" v-model.number="form.price" min="0" validation="required|number" messages-class="text-[#E9556D] font-mono" placeholder="Цена (₽)" name="Цена" outer-class="w-full" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
                <FormKit type="textarea" v-model="form.description" rows="5" messages-class="text-[#E9556D] font-mono" placeholder="Описание услуги" name="Описание" outer-class="w-full" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
            </div>

            <div class="relative w-full md:w-2/3 lg:w-1/2 group rounded-xl overflow-hidden" v-if="imagePreview">
                <img :src="imagePreview" alt="" class="object-cover object-center aspect-square w-full">
                <button type="button" @click="removeImage" class="absolute inset-0 bg-black/70 flex items-center justify-center transition-all duration-500 [@media(pointer:coarse)]:opacity-100 [@media(pointer:fine)]:opacity-0 group-hover:opacity-100">
                    <Icon class="text-3xl text-red-500" name="material-symbols:delete-outline"/>
                </button>
            </div>
            <FormKit v-else @change="handleImageChange" accept="image/*" validation="required" messages-class="text-[#E9556D] font-mono" label-class="text-white" file-list-class="text-white" no-files-class="text-white" type="file" label="Изображение" name="Изображение" outer-class="w-full md:w-2/3 lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>

            <button :disabled="isLoading" :class="{ 'opacity-50 cursor-not-allowed': isLoading }" type="submit" class="px-4 py-2 border border-sky-500 bg-sky-500 text-white rounded-full w-[200px] text-center transition-all duration-500 hover:text-sky-500 hover:bg-transparent">{{ isLoading ? 'Создание...' : 'Создать услугу' }}</button>
        </FormKit>
    </div>
</template>

<script setup>
/* название и язык страницы */
useSeoMeta({
    title: 'Добавить услугу',
    lang: 'ru'
})

/* сторы и клиент */
const { id: userId, isProvider } = useUserStore()
const { showMessage } = useMessagesStore()
const supabase = useSupabaseClient()
const router = useRouter()

/* форма */
const form = ref({
    title: '',
    category_id: '',
    price: null,
    description: '',
    image_url: ''
})

/* категории */
const categoryOptions = ref([])

/* загрузка и изображение */
const isLoading = ref(false)
const imageFile = ref(null)
const imagePreview = ref('')

const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
        imageFile.value = file
        const reader = new FileReader()
        reader.onload = (ev) => {
            imagePreview.value = ev.target.result
        }
        reader.readAsDataURL(file)
    }
}

const removeImage = () => {
    imageFile.value = null
    imagePreview.value = ''
    form.value.image_url = ''
}

/* загрузка категорий */
const loadCategories = async () => {
    const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name', { ascending: true })
    if (!error && data) {
        categoryOptions.value = data.map(c => ({ label: c.name, value: c.id }))
    }
}

/* сохранение услуги */
const create = async () => {
    if (!isProvider) {
        return showMessage('Только исполнитель может добавлять услуги', false)
    }
    if (!imageFile.value) {
        return showMessage('Загрузите изображение услуги', false)
    }

    isLoading.value = true
    try {
        // загружаем изображение
        const extension = imageFile.value.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${extension}`
        const { error: uploadError } = await supabase.storage
            .from('files')
            .upload(`services/${fileName}`, imageFile.value)
        if (uploadError) throw uploadError

        // создаём запись в БД
        const { error: insertError } = await supabase
            .from('services')
            .insert({
                provider_id: userId,
                title: form.value.title,
                description: form.value.description,
                price: form.value.price,
                category_id: form.value.category_id,
                image_url: fileName
            })
        if (insertError) throw insertError

        showMessage('Услуга создана!', true)
        await router.push('/profile')
    } catch (error) {
        showMessage('Ошибка при создании услуги: ' + (error?.message || ''), false)
    } finally {
        isLoading.value = false
    }
}

onMounted(async () => {
    await loadCategories()
})
</script>
