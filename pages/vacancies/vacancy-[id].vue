<template>
    <div class="flex flex-col gap-6">
        <NuxtLink to="/vacancies"
                class="w-fit py-1.5 px-4 rounded-xl hover:text-white hover:bg-sky-500 border border-sky-500 transition-all duration-500 bg-transparent text-sky-500">
                Назад</NuxtLink>
        <p class="mainHeading">{{ vacancy?.name }}</p>
        <p>{{ vacancy?.salary.toLocaleString() }} ₽ в месяц</p>
        <div class="flex flex-col gap-2 text-base text-gray-400">
            <p><span class="font-semibold text-white">Опыт:</span> {{ vacancy?.exp }}</p>
            <p><span class="font-semibold text-white">График:</span> {{ vacancy?.schedule }}</p>
            <p><span class="font-semibold text-white">Формат:</span> {{ vacancy?.format }}</p>
        </div>
        <div class="flex flex-col gap-4">
            <div class="flex items-center gap-2 text-white">
                <img :src="`https://nwsapzsylxovhsbbxnhq.supabase.co/storage/v1/object/public/files/logos/${vacancy?.employers?.logo}`" alt="" class="aspect-square object-cover object-center w-10 rounded-full">
                <p>{{ vacancy?.employers?.companyName }}</p>
            </div>
            <p>{{ vacancy?.employers.desc }}</p>
        </div>
        <div class="flex flex-col gap-4">
            <p class="text-xl text-white font-mono font-semibold">Описание вакансии</p>
            <p>{{ vacancy?.desc }}</p>
        </div>
        <div class="flex flex-col gap-4">
            <p class="text-xl text-white font-mono font-semibold">Требования вакансии</p>
            <p>{{ vacancy?.requirements }}</p>
        </div>
        <button @click="sendResponse(vacancy?.id)"
            :class="[isResponded(vacancy?.id) ? 'opacity-50' : 'cursor-pointer hover:bg-transparent hover:text-sky-500']"
            :disabled="isResponded(vacancy?.id)"
            class="w-fit py-1.5 px-4 rounded-xl border border-sky-500 bg-sky-500 text-white transition-all duration-500">{{
                isResponded(vacancy?.id) ? 'Отклик отправлен' : 'Откликнуться' }}</button>
    </div>
</template>

<script setup>
/* название и язык страницы */
useSeoMeta({
    title: 'Страница вакансии',
    lang: 'ru'
})


/* получение id товара и сообщения */
const route = useRoute()
const { showMessage } = useMessagesStore()


/* подключение бд и поулчение данных */
const supabase = useSupabaseClient()
const userStore = useUserStore()
const { id: userId, role } = userStore

const vacancy = ref()
const fetchData = async () => {
    const { data, error } = await supabase
    .from('vacancies')
    .select('*, employers(*)')
    .eq('id', route.params.id)
    .single()

    if(data) vacancy.value = data
}


/* определение id отправившего */
const mainId = ref() // id в зависимости от роли
const roleTableMap = { // таблица в зависимости от роли
    employer: 'employers',
    applicant: 'applicants'
}

const fetchProfileData = async (userRole, userId) => {
    const table = roleTableMap[userRole]

    const { data, error } = await supabase
        .from(table)
        .select()
        .eq('user_id', userId)
        .single()

    if (data) {
        mainId.value = data.id
    }
}


/* получение откликов и отправка */
const responses = ref([])
const fetchResponses = async () => {
    const { data } = await supabase
        .from('interactions')
        .select('vacancy_id')
        .eq('applicant_id', mainId.value)
        .eq('type', 'response')
    responses.value = data || []
}

const sendResponse = async (vacancyId) => {
    const { data, error } = await supabase.from('interactions').insert({
        type: 'response',
        vacancy_id: vacancyId,
        applicant_id: mainId.value,
        employer_id: (await supabase.from('vacancies').select('employer_id').eq('id', vacancyId).single()).data.employer_id,
    })

    if (!error) {
        showMessage('Заявка отправлена!', true)
        await fetchResponses()
    } else {
        showMessage('Произошла ошибка!', false)
    }

}

const isResponded = (id) => responses.value.some(r => r.vacancy_id === id)


/* первоначальная загрузка */
onMounted(async () => {
    await fetchProfileData(role, userId)
    await fetchData()
    await fetchResponses()
})
</script>