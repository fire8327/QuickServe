<template>
    <div class="flex flex-col gap-6">
        <p class="mainHeading" v-if="role === 'employer'">Добавление вакансии</p>
        <p class="mainHeading" v-if="role === 'applicant'">Добавление резюме</p>
        <FormKit @submit="addEntry" type="form" :actions="false" messages-class="hidden" form-class="flex flex-col gap-6 items-center justify-center text-[#1C1C1C]">
            <!-- для соискателя -->
            <template v-if="role === 'applicant'">
                <FormKit v-model="mainForm.name" validation="required" messages-class="text-[#E9556D] font-mono" type="text" placeholder="Желаемая должность" name="Желаемая должность" outer-class="w-full md:w-2/3 lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
                <div class="flex items-center lg:items-start gap-4 max-lg:flex-col w-full md:w-2/3 lg:w-1/2">
                    <FormKit v-model="mainForm.exp" validation="required" messages-class="text-[#E9556D] font-mono" type="select" :options="['Без опыта', 'До 1 года', '1-3 года', '3-5 лет', 'Более 5 лет']" placeholder="Опыт работы" name="Опыт работы" outer-class="w-full lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
                    <FormKit v-model="mainForm.salary" validation="required|number" messages-class="text-[#E9556D] font-mono" type="text" placeholder="Желаемая зарплата" name="Желаемая зарплата" outer-class="w-full lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
                </div>
                <FormKit v-model="mainForm.education" validation="required" messages-class="text-[#E9556D] font-mono" type="select" :options="['Среднее', 'Среднее специальное', 'Неоконченное высшее', 'Высшее', 'Бакалавр', 'Магистр', 'Аспирантура']" placeholder="Образование" name="Образование" outer-class="w-full md:w-2/3 lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
                <FormKit validation="required" @change="(e) => { resumeFile = e.target.files[0] }" accept=".pdf, .doc, .docx" messages-class="text-[#E9556D] font-mono" type="file" label="Резюме" name="Резюме" outer-class="w-full md:w-2/3 lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
                <FormKit v-model="skillsInput" validation="required" messages-class="text-[#E9556D] font-mono" type="textarea" placeholder="Напишите навыки через запятую" name="Навыки" outer-class="w-full md:w-2/3 lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
                <div class="flex flex-col gap-2 w-full md:w-2/3 lg:w-1/2" v-if="mainForm.skills && mainForm.skills.length > 0">
                    <p>Навыки</p>
                    <div class="w-full flex items-center gap-2 flex-wrap">
                        <button type="button" @click="removeSkill(index)" class="cursor-pointer flex items-center gap-2 py-1.5 px-4 rounded-xl bg-sky-500 text-white text-sm uppercase" v-for="(skill, index) in mainForm.skills" :key="index">
                            <span>{{ skill }}</span>
                            <Icon class="text-2xl" name="material-symbols-light:close-small-rounded"/>
                        </button>
                    </div>    
                </div>
            </template>
            <!-- для компании -->
            <template v-if="role === 'employer'">
                <FormKit v-model="mainForm.name" validation="required" messages-class="text-[#E9556D] font-mono" type="text" placeholder="Наименование вакансии" name="Наименование вакансии" outer-class="w-full md:w-2/3 lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
                <div class="flex items-center lg:items-start gap-4 max-lg:flex-col w-full md:w-2/3 lg:w-1/2">
                    <FormKit v-model="mainForm.exp" validation="required" messages-class="text-[#E9556D] font-mono" type="select" :options="['Без опыта', 'До 1 года', '1-3 года', '3-5 лет', 'Более 5 лет']" placeholder="Опыт работы" name="Опыт работы" outer-class="w-full lg:w-1/3" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
                    <FormKit v-model="mainForm.salary" validation="required|number" messages-class="text-[#E9556D] font-mono" type="text" placeholder="Зарплата" name="Зарплата" outer-class="w-full lg:w-1/3" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
                    <FormKit v-model="mainForm.format" validation="required" messages-class="text-[#E9556D] font-mono" type="select" :options="['Удалённый', 'Офис', 'Гибрид', 'Вахта', 'Проектный']" placeholder="Формат" name="Формат" outer-class="w-full lg:w-1/3" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
                </div>
                <FormKit v-model="mainForm.schedule" validation="required" messages-class="text-[#E9556D] font-mono" type="select" :options="['5/2', '6/1', '2/2', '1/2', '1/3', 'Неделя через неделю', 'Дежурства', 'Гибкий график']" placeholder="График" name="График" outer-class="w-full md:w-2/3 lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
                <FormKit v-model="mainForm.desc" validation="required" messages-class="text-[#E9556D] font-mono" type="textarea" placeholder="Описание вакансии" name="Описание вакансии" outer-class="w-full md:w-2/3 lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
                <FormKit v-model="mainForm.requirements" validation="required" messages-class="text-[#E9556D] font-mono" type="textarea" placeholder="Требования" name="Требования" outer-class="w-full md:w-2/3 lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
            </template>
            <button type="submit" class="px-4 py-2 border border-sky-500 bg-sky-500 text-white rounded-full w-[160px] text-center transition-all duration-500 hover:text-sky-500 hover:bg-transparent">Добавить</button>
        </FormKit>
    </div>
</template>

<script setup>
    /* название и язык страницы */
    useSeoMeta({
        title: 'Добавление записи',
        lang: 'ru'
    })


    /* создание роутера */
    const router = useRouter()


    /* проверка роли и создание сообщений */
    const { id:userId, role, profileCompleted, updateProfileCompleted, logout } = useUserStore()
    const { showMessage } = useMessagesStore()


    /* подключение к бд и получение id, который отправил форму */
    const supabase = useSupabaseClient()
    const mainId = ref() // id в зависимости от роли
    const roleTableMap = { // таблица в зависимости от роли
        employer: 'employers',
        applicant: 'applicants'
    }
    // функция получения данных
    const fetchProfileData = async(userRole, userId) => {
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


    /* создание формы */
    // форма для компании
    const employerForm = {
        name: '',           // Название вакансии
        desc: '',           // Описание вакансии
        exp: '',            // Требуемый опыт
        salary: null,       // Зарплата
        format: '',         // Формат работы (офис/удалённо)
        requirements: '',   // Требования
        schedule: '',       // График
        employer_id: null,  // ID работодателя
    }

    // форма для соискателя
    const applicantForm = {
        name: '',           // Желаемая должность
        exp: '',            // Опыт работы
        salary: '',         // Желаемая зарплата
        education: '',      // Образование
        skills: {},         // Навыки (объект или массив)
        resume: '',         // Резюме (например, текст или путь к файлу)
        applicant_id: null, // ID соискателя
    }

    // динамическая форма в зависимости от роли
    const mainForm = ref({})
    const initForm = () => {
        if (role.value === 'employer') {
            mainForm.value = { ...employerForm, employer_id: mainId.value }
        } else if (role.value === 'applicant') {
            mainForm.value = { ...applicantForm, applicant_id: mainId.value }
        }
        skillsInput.value = ''
    }

    // слежение за изменением id
    watch(mainId, (newId) => {
        if (role === 'employer') {
            mainForm.value.employer_id = newId;
        } else if (role === 'applicant') {
            mainForm.value.applicant_id = newId;
        }
    })


    /* логика навыков */
    const skillsInput = ref('')
    const updateSkills = () => {
        const skillsText = skillsInput.value.toLocaleLowerCase().trim()
        if (!skillsText) {
            mainForm.value.skills = []
            return
        }

        mainForm.value.skills = [
            ...new Set(
                skillsText
                    .split(',')
                    .map(s => s.trim())
                    .filter(Boolean) // автоматически удаляет пустые строки
            )
        ]
    }
    watch(skillsInput, (newValue, oldValue) => {
        updateSkills()
    })

    // удаление навыков
    const removeSkill = (index) => {
        mainForm.value.skills.splice(index, 1)
        // обновляем textarea, чтобы оно соответствовало текущему списку навыков
        skillsInput.value = mainForm.value.skills.join(', ')
    }


    /* логика резюме */
    const resumeFile = ref(null)


    /* отправка в зависимости от роли */
    const addEntry = async() => {
        // обработка резюме
        if (resumeFile.value) {
            const file = resumeFile.value
            const extension = file.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${extension}`

                
            const { error: uploadError } = await supabase.storage
            .from('files/resumes')
            .upload(`${fileName}`, file)

            if (uploadError) throw uploadError

            mainForm.value.resume = fileName

        }

        // выбор таблицы
        const table = role === 'applicant' ? 'resumes' : 'vacancies'

        const { data, error } = await supabase
        .from(table)
        .insert(mainForm.value)
        .select()

        if (data) {
            console.log(data)
            showMessage('Успешно добавлено!', true)
            router.push('/profile')
        } else {
            console.log(user.value)
            showMessage('Произошла ошибка!', false)
        }
    }


    /* инициализация данных */
    onMounted(() => {
        fetchProfileData(role, userId)
        initForm()
    })
</script>