<template>
    <div class="flex flex-col gap-6">
        <p class="mainHeading">Фильтрация</p>
        <div class="flex flex-col items-center gap-6 w-full text-[#1C1C1C]">
            <FormKit v-model="searchQuery.name" type="text"
                placeholder="Наименование вакансии" name="Наименование вакансии" outer-class="w-full md:w-2/3 lg:w-1/2"
                input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md" />
            <div class="flex items-center lg:items-start gap-4 max-lg:flex-col w-full md:w-2/3 lg:w-1/2">
                <FormKit v-model="searchQuery.exp" type="select" :options="['Без опыта', 'До 1 года', '1-3 года', '3-5 лет', 'Более 5 лет']" placeholder="Опыт работы" name="Опыт работы" outer-class="w-full lg:w-1/3" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
                <FormKit v-model="searchQuery.schedule" type="select" :options="['5/2', '6/1', '2/2', '1/2', '1/3', 'Неделя через неделю', 'Дежурства', 'Гибкий график']" placeholder="График" name="График" outer-class="w-full lg:w-1/3" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
                <FormKit v-model="searchQuery.format" type="select" :options="['Удалённый', 'Офис', 'Гибрид', 'Вахта', 'Проектный']" placeholder="Формат" name="Формат" outer-class="w-full lg:w-1/3" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
            </div>
        </div>
    </div>
    <div class="flex flex-col gap-6" v-if="vacancies && vacancies.length > 0">
        <p class="mainHeading">Список вакансий</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-[#1C1C1C]">
            <div class="flex flex-col gap-4 p-4 rounded-xl shadow-lg bg-white" v-for="vacancy in vacancies">
                <NuxtLink :to="`/vacancies/vacancy-${vacancy.id}`" class="cursor-pointer self-end transition-all duration-500 hover:scale-110">
                    <Icon class="text-3xl text-sky-500" name="material-symbols:eye-tracking-rounded" />
                </NuxtLink>
                <p>{{ vacancy.name }}</p>
                <p class="line-clamp-2">{{ vacancy.desc }}</p>
                <p><span class="font-semibold font-mono">Опыт: </span>{{ vacancy.exp }}</p>
                <p><span class="font-semibold font-mono">Формат: </span>{{ vacancy.format }}</p>
                <p><span class="font-semibold font-mono">График: </span>{{ vacancy.schedule }}</p>
                <p><span class="font-semibold font-mono">Зарплата: </span>{{ vacancy.salary.toLocaleString() }} ₽</p>
                <button @click="sendResponse(vacancy.id)"
                    :class="[isResponded(vacancy.id) ? 'opacity-50' : 'cursor-pointer hover:bg-transparent hover:text-sky-500']"
                    :disabled="isResponded(vacancy.id)"
                    class="w-full py-1.5 px-4 rounded-xl border border-sky-500 bg-sky-500 text-white transition-all duration-500">{{
                        isResponded(vacancy.id) ? 'Отклик отправлен' : 'Откликнуться' }}</button>
            </div>
        </div>
    </div>
    <div class="flex flex-col gap-6 items-center text-center" v-else>
        <p class="mainHeading">Не найдено ни одной вакансии</p>
        <div class="flex items-center gap-4 max-md:flex-col w-full md:w-2/3">
            <button @click="cancelFilters"
                class="cursor-pointer w-full md:w-1/2 py-1.5 px-4 rounded-xl text-white bg-sky-500 border border-sky-500 transition-all duration-500 hover:bg-transparent hover:text-sky-500">Сбросить
                фильтры</button>
            <NuxtLink to="/"
                class="w-full md:w-1/2 py-1.5 px-4 rounded-xl hover:text-white hover:bg-sky-500 border border-sky-500 transition-all duration-500 bg-transparent text-sky-500">
                Вернуться на главную</NuxtLink>
        </div>
    </div>
</template>

<script setup>
/* название и язык страницы */
useSeoMeta({
    title: 'Вакансии',
    lang: 'ru'
})


/* подключение сообщений */
const { showMessage } = useMessagesStore()


/* подключение бд и хранилищ */
const supabase = useSupabaseClient()
const userStore = useUserStore()
const { id: userId, role } = userStore


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


/* получение данных и фильтрация */
const vacancies = ref([])
const responses = ref([])
const searchQuery = ref({
    name: '',
    exp: '',
    schedule: '',
    format: ''
})

const fetchVacancies = async () => {
    let query = supabase.from('vacancies').select().eq('status', 'Одобрена')
    if (searchQuery.value.name) query = query.ilike('name', `%${searchQuery.value.name}%`)
    if (searchQuery.value.exp) query = query.eq('exp', searchQuery.value.exp)
    if (searchQuery.value.format) query = query.eq('format', searchQuery.value.format)
    if (searchQuery.value.schedule) query = query.eq('schedule', searchQuery.value.schedule)

    const { data } = await query
    vacancies.value = data || []
}

// фильтрация
watch(searchQuery.value, (newValue, oldValue) => {
    fetchVacancies()
})

// отмена фильтрации
const cancelFilters = () => {
    searchQuery.value = {
        name: '',
        exp: '',
        salary: '',
        format: ''
    }
    fetchVacancies()
}


/* получение откликов и отправка */
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
    await fetchVacancies()
    await fetchResponses()
})

</script>