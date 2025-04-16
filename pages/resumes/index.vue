<template>
    <div class="flex flex-col gap-6">
        <p class="mainHeading">Фильтрация</p>
        <div class="flex flex-col items-center gap-6 w-full text-[#1C1C1C]">
            <FormKit v-model="searchQuery.name" type="text"
                placeholder="Желаемая должность" name="Желаемая должность" outer-class="w-full md:w-2/3 lg:w-1/2"
                input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md" />
            <div class="flex items-center lg:items-start gap-4 max-lg:flex-col w-full md:w-2/3 lg:w-1/2">
                <FormKit v-model="searchQuery.exp" type="select" :options="['Без опыта', 'До 1 года', '1-3 года', '3-5 лет', 'Более 5 лет']" placeholder="Опыт работы" name="Опыт работы" outer-class="w-full lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
                <FormKit v-model="searchQuery.education" type="select" :options="['Среднее', 'Среднее специальное', 'Неоконченное высшее', 'Высшее', 'Бакалавр', 'Магистр', 'Аспирантура']" placeholder="Образование" name="Образование" outer-class="w-full lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
            </div>
        </div>
    </div>
    <div class="flex flex-col gap-6" v-if="resumes && resumes.length > 0">
        <p class="mainHeading">Список резюме</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-[#1C1C1C]">
            <div class="flex flex-col gap-4 p-4 rounded-xl shadow-lg bg-white" v-for="resume in resumes">
                <NuxtLink :to="`/resumes/resume-${resume.id}`" class="cursor-pointer self-end transition-all duration-500 hover:scale-110">
                    <Icon class="text-3xl text-sky-500" name="material-symbols:eye-tracking-rounded" />
                </NuxtLink>
                <p>{{ resume.name }}</p>
                <p><span class="font-semibold font-mono">Опыт: </span>{{ resume.exp }}</p>
                <p><span class="font-semibold font-mono">Образование: </span>{{ resume.education }}</p>
                <p><span class="font-semibold font-mono">Зарплата: </span>{{ resume.salary.toLocaleString() }} ₽</p>
                <button @click="sendOffer(resume.id)"
                    :class="[isOffered(resume.id) ? 'opacity-50' : 'cursor-pointer hover:bg-transparent hover:text-sky-500']"
                    :disabled="isOffered(resume.id)"
                    class="w-full py-1.5 px-4 rounded-xl border border-sky-500 bg-sky-500 text-white transition-all duration-500">{{
                        isOffered(resume.id) ? 'Предложение отправлено' : 'Предложить работу' }}</button>
            </div>
        </div>
    </div>
    <div class="flex flex-col gap-6 items-center text-center" v-else>
        <p class="mainHeading">Не найдено ни одного резюме</p>
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
    title: 'Резюме',
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
const resumes = ref([])
const offers = ref([])
const searchQuery = ref({
    name: '',
    exp: '',
    education: ''
})

const fetchResumes = async () => {
  let query = supabase.from('resumes').select('*').eq('status', 'Одобрено')
  if (searchQuery.value.name) query = query.ilike('name', `%${searchQuery.value.name}%`)
  if (searchQuery.value.exp) query = query.eq('exp', searchQuery.value.exp)
  if (searchQuery.value.education) query = query.eq('education', searchQuery.value.education)

  const { data } = await query
  resumes.value = data || []
}

// фильтрация
watch(searchQuery.value, (newValue, oldValue) => {
    fetchResumes()
})

// отмена фильтрации
const cancelFilters = () => {
    searchQuery.value = {
        name: '',
        exp: '',
        education: ''
    }
    fetchResumes()
}


/* получение офферов и отправка */
const fetchOffers = async () => {
  const { data } = await supabase
    .from('interactions')
    .select('resume_id')
    .eq('employer_id', mainId.value)
    .eq('type', 'offer')
  offers.value = data || []
}

const sendOffer = async (resumeId) => {
  const { data, error } = await supabase.from('interactions').insert({
    type: 'offer',
    resume_id: resumeId,
    employer_id: mainId.value,
    applicant_id: (await supabase.from('resumes').select('applicant_id').eq('id', resumeId).single()).data.applicant_id,
  })

    if (!error) {
        showMessage('Предложение отправлено!', true)
        await fetchOffers()
    } else {
        showMessage('Произошла ошибка!', false)
    }
}

const isOffered = (id) => offers.value.some(o => o.resume_id === id)


/* первоначальная загрузка */
onMounted(async () => {
    await fetchProfileData(role, userId)
    await fetchResumes()
    await fetchOffers()
})
</script>