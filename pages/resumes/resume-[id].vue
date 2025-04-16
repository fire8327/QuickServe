<template>
    <div class="flex flex-col gap-6">
        <NuxtLink to="/resumes"
            class="w-fit py-1.5 px-4 rounded-xl hover:text-white hover:bg-sky-500 border border-sky-500 transition-all duration-500 bg-transparent text-sky-500">
            Назад</NuxtLink>
        <p class="mainHeading">{{ resume?.name }}</p>
        <p>{{ resume?.salary.toLocaleString() }} ₽ в месяц</p>
        <div class="flex flex-col gap-2 text-base text-gray-400">
            <p><span class="font-semibold text-white">Опыт:</span> {{ resume?.exp }}</p>
            <p><span class="font-semibold text-white">Образование:</span> {{ resume?.education }}</p>
        </div>
        <div class="flex flex-col gap-4">
            <p class="text-xl text-white font-semibold font-mono">Навыки</p>
            <div class="w-full lg:w-1/3 flex flex-wrap gap-2">
                <p class="px-6 rounded-xl bg-sky-500 text-white" v-for="skill in resume?.skills">{{ skill }}</p>
            </div>
        </div>
        <div class="flex flex-col gap-4">
            <p class="text-xl text-white font-semibold font-mono">Информация о кандидате</p>
            <p><span class="font-semibold font-mono text-white">ФИО:</span> {{ resume?.applicants.surname }} {{
                resume?.applicants.name }} {{ resume?.applicants.patronymic }}</p>
            <p><span class="font-semibold font-mono text-white">Номер телефона:</span> {{ resume?.applicants.phone }}</p>
            <a v-if="resume?.resume" :href="`https://unhdwdwoeepepaliejow.supabase.co/storage/v1/object/public/files/resumes/${resume?.resume}`" download="Резюме соискателя" target="_blank" class="font-semibold text-xl text-white font-mono w-fit flex flex-col after:w-0 after:h-[3px] after:rounded-full after:bg-white after:transition-all after:duration-500 hover:after:w-full">Скачать резюме</a> 
            <p v-else class="text-xl text-white font-semibold font-mono">Ошибка: резюме не загружено</p>
        </div>
        <button @click="sendOffer(resume?.id)"
            :class="[isOffered(resume?.id) ? 'opacity-50' : 'cursor-pointer hover:bg-transparent hover:text-sky-500']"
            :disabled="isOffered(resume?.id)"
            class="w-fit py-1.5 px-4 rounded-xl border border-sky-500 bg-sky-500 text-white transition-all duration-500">{{
                isOffered(resume?.id) ? 'Предложение отправлено' : 'Предложить работу' }}</button>
    </div>
</template>

<script setup>
/* название и язык страницы */
useSeoMeta({
    title: 'Страница резюме',
    lang: 'ru'
})


/* получение id товара и сообщения */
const route = useRoute()
const { showMessage } = useMessagesStore()


/* подключение бд и поулчение данных */
const supabase = useSupabaseClient()
const userStore = useUserStore()
const { id: userId, role } = userStore

const resume = ref()
const fetchData = async () => {
    const { data, error } = await supabase
    .from('resumes')
    .select('*, applicants(*)')
    .eq('id', route.params.id)
    .single()

    if(data) resume.value = data
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


/* получение офферов и отправка */
const offers = ref([])
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
    await fetchData()
    await fetchOffers()
})
</script>