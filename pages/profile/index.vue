<template>
    <div class="flex flex-col gap-6">
        <p class="mainHeading">Данные профиля</p>
        <p v-if="!userStore.profileCompleted" class="opacity-50 text-base">* закончите заполнения вашего профиля ниже</p>
        <FormKit @submit="saveProfile" v-if="role === 'applicant'" type="form" :actions="false" messages-class="hidden" form-class="text-[#1C1C1C] flex flex-col gap-6 items-center justify-center">
            <div class="flex items-center lg:items-start gap-4 max-lg:flex-col w-full md:w-2/3 lg:w-1/2">
                <FormKit v-model="userForm.surname" validation="required" messages-class="text-[#E9556D] font-mono" type="text" placeholder="Фамилия" name="Фамилия" outer-class="w-full lg:w-1/3" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
                <FormKit v-model="userForm.name" validation="required" messages-class="text-[#E9556D] font-mono" type="text" placeholder="Имя" name="Имя" outer-class="w-full lg:w-1/3" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
                <FormKit v-model="userForm.patronymic" validation="required" messages-class="text-[#E9556D] font-mono" type="text" placeholder="Отчество" name="Отчество" outer-class="w-full lg:w-1/3" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
            </div>
            <FormKit v-model="userForm.phone" validation="required|number" messages-class="text-[#E9556D] font-mono" type="text" placeholder="Телефон" name="Телефон" outer-class="w-full md:w-2/3 lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
            <button :disabled="isLoading" :class="{ 'opacity-50 cursor-not-allowed': isLoading }" type="submit" class="px-4 py-2 border border-sky-500 bg-sky-500 text-white rounded-full w-[160px] text-center transition-all duration-500 hover:text-sky-500 hover:bg-transparent">{{ isLoading ? 'Сохранение...' : 'Сохранить' }}</button>
        </FormKit>
        <FormKit @submit="saveProfile" v-if="role === 'employer'" type="form" :actions="false" messages-class="hidden" form-class="text-[#1C1C1C] flex flex-col gap-6 items-center justify-center">
            <div class="flex items-center lg:items-start gap-4 max-lg:flex-col w-full md:w-2/3 lg:w-1/2">
                <FormKit v-model="userForm.companyName" validation="required" messages-class="text-[#E9556D] font-mono" type="text" placeholder="Наименование" name="Наименование" outer-class="w-full lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
                <FormKit v-model="userForm.inn" validation="required" messages-class="text-[#E9556D] font-mono" type="text" placeholder="ИНН" name="ИНН" outer-class="w-full lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
            </div>
            <div class="relative w-full md:w-2/3 lg:w-1/2 group rounded-xl overflow-hidden" v-if="userForm.logo">
                <img :src="getLogoUrl(userForm.logo)" alt="" class="object-cover object-center aspect-square w-full">
                <button @click="removeLogoFile" class="absolute inset-0 bg-black/70 flex items-center justify-center transition-all duration-500 [@media(pointer:coarse)]:opacity-100 [@media(pointer:fine)]:opacity-0 group-hover:opacity-100">
                    <Icon class="text-3xl text-red-500" name="material-symbols:delete-outline"/>
                </button>
            </div>
            <FormKit v-else @change="(e) => { logoFile = e.target.files[0] }" accept="image/*" validation="required" messages-class="text-[#E9556D] font-mono" type="file" label="Логотип" name="Логотип" outer-class="w-full md:w-2/3 lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
            <FormKit v-model="userForm.address" validation="required" messages-class="text-[#E9556D] font-mono" type="textarea" placeholder="Адрес компании" name="Адрес компании" outer-class="w-full md:w-2/3 lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
            <FormKit v-model="userForm.desc" validation="required" messages-class="text-[#E9556D] font-mono" type="textarea" placeholder="Описание компании" name="Описание компании" outer-class="w-full md:w-2/3 lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
            <button :disabled="isLoading" :class="{ 'opacity-50 cursor-not-allowed': isLoading }" type="submit" class="px-4 py-2 border border-sky-500 bg-sky-500 text-white rounded-full w-[160px] text-center transition-all duration-500 hover:text-sky-500 hover:bg-transparent">{{ isLoading ? 'Сохранение...' : 'Сохранить' }}</button>
        </FormKit>
    </div>
    <div class="flex flex-col gap-6">
        <p class="mainHeading">Настройки приватности</p>
        <FormKit :form-attrs="{ autocomplete: 'off' }" @submit="updPrivacy" type="form" :actions="false" messages-class="hidden" form-class="text-[#1C1C1C] flex flex-col gap-6 items-center justify-center">
            <div class="flex items-center lg:items-start gap-4 max-lg:flex-col w-full md:w-2/3 lg:w-1/2">
                <FormKit v-model="privacyForm.login" validation="required" messages-class="text-[#E9556D] font-mono" type="text" placeholder="Логин" name="Логин" outer-class="w-full lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
                <FormKit v-model="privacyForm.password" validation="required" messages-class="text-[#E9556D] font-mono" type="password" placeholder="Пароль" name="Пароль" outer-class="w-full lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
            </div>
            <FormKit v-model="privacyForm.email" validation="required|email" messages-class="text-[#E9556D] font-mono" type="email" placeholder="Email" name="Email" outer-class="w-full md:w-2/3 lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
            <button :disabled="isLoading" :class="{ 'opacity-50 cursor-not-allowed': isLoading }" type="submit" class="px-4 py-2 border border-sky-500 bg-sky-500 text-white rounded-full w-[160px] text-center transition-all duration-500 hover:text-sky-500 hover:bg-transparent">{{ isLoading ? 'Сохранение...' : 'Сохранить' }}</button>
        </FormKit>
    </div>
    <div v-if="userStore.profileCompleted">
        <div class="flex flex-col gap-6" v-if="role === 'employer'">
            <p class="mainHeading">Вакансии</p>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-[#1C1C1C]" v-if="vacancies && vacancies.length > 0">
                <div class="flex flex-col gap-4 p-4 rounded-xl shadow-lg bg-white" v-for="vacancy in vacancies">
                    <button type="button" @click="deleteVacancy(vacancy.id)" class="cursor-pointer self-end">
                        <Icon class="text-3xl text-red-500" name="material-symbols:delete-outline"/>
                    </button>
                    <p>{{ vacancy.name }}</p>
                    <p class="line-clamp-2">{{ vacancy.desc }}</p>
                    <p><span class="font-semibold font-mono">Опыт: </span>{{ vacancy.exp }}</p>
                    <p><span class="font-semibold font-mono">График: </span>{{ vacancy.schedule }}</p>
                    <p><span class="font-semibold font-mono">Статус: </span>{{ vacancy.status }}</p>
                </div>
                <NuxtLink to="/profile/add-entry" class="flex items-center justify-center gap-4 w-full py-6 bg-white rounded-xl shadow-lg transition-all duration-500 hover:opacity-60">
                    <Icon class="text-3xl" name="material-symbols:add-diamond-rounded"/>
                    <span>Добавить</span>
                </NuxtLink>
            </div>
            <div v-else class="flex flex-col w-full items-center gap-4 text-center">
                <p class="text-xl text-white font-semibold font-mono">Вы пока ничего не опубликовали</p>
                <NuxtLink to="/profile/add-entry" class="px-4 py-2 border border-sky-500 bg-sky-500 text-white rounded-full text-center transition-all duration-500 hover:text-sky-500 hover:bg-transparent">Добавьте вакансию</NuxtLink>
                <p class="font-semibold font-mono">, чтобы получить первые отклики</p>
            </div>
        </div>
        <div class="flex flex-col gap-6" v-if="role === 'applicant'">
            <p class="mainHeading">Резюме</p>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-[#1C1C1C]" v-if="resumes && resumes.length > 0">
                <div class="flex flex-col gap-4 p-4 rounded-xl shadow-lg bg-white" v-for="resume in resumes">
                    <button type="button" @click="deleteResume(resume.id)" class="cursor-pointer self-end">
                        <Icon class="text-3xl text-red-500" name="material-symbols:delete-outline"/>
                    </button>
                    <p>{{ resume.name }}</p>
                    <p><span class="font-semibold font-mono">Опыт: </span>{{ resume.exp }}</p>
                    <p><span class="font-semibold font-mono">Образование: </span>{{ resume.education }}</p>
                    <p><span class="font-semibold font-mono">Статус: </span>{{ resume.status }}</p>
                </div>
                <NuxtLink to="/profile/add-entry" class="flex items-center justify-center gap-4 w-full py-6 bg-white rounded-xl shadow-lg transition-all duration-500 hover:opacity-60">
                    <Icon class="text-3xl" name="material-symbols:add-diamond-rounded"/>
                    <span>Добавить</span>
                </NuxtLink>
            </div>
            <div v-else class="flex flex-col w-full items-center gap-4 text-center">
                <p class="text-xl text-white font-semibold font-mono">Вы пока ничего не опубликовали</p>
                <NuxtLink to="/profile/add-entry" class="px-4 py-2 border border-sky-500 bg-sky-500 text-white rounded-full text-center transition-all duration-500 hover:text-sky-500 hover:bg-transparent">Добавьте резюме</NuxtLink>
                <p class="font-semibold font-mono">, чтобы отправить первые отклики</p>
            </div>
        </div>
    </div>
    <div class="flex flex-col gap-6" v-if="role === 'applicant' && userStore.profileCompleted">
        <p class="mainHeading">Мои отклики</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-[#1C1C1C]" v-if="responses && responses.length > 0">
            <div class="flex flex-col gap-4 p-4 rounded-xl bg-white shadow-lg" v-for="response in responses" :key="response.id">
                <button type="button" @click="cancelResponse(response.id)" class="cursor-pointer self-end" v-if="response.status === 'На рассмотрении'">
                    <Icon class="text-3xl text-red-500" name="material-symbols:delete-outline"/>
                </button>
                <p><span class="font-semibold font-mono">Вакансия:</span> {{ response.vacancy.name }}</p>
                <p><span class="font-semibold font-mono">Статус:</span> {{ response.status }}</p>
            </div>
        </div>
        <div v-else class="flex flex-col w-full items-center gap-4 text-center">
            <p class="text-xl text-white font-semibold font-mono">Вы пока не отправляли отклики</p>
            <NuxtLink to="/vacancies" class="px-4 py-2 border border-sky-500 bg-sky-500 text-white rounded-full text-center transition-all duration-500 hover:text-sky-500 hover:bg-transparent">Отправить отклик</NuxtLink>
        </div>
    </div>
    <div class="flex flex-col gap-6" v-if="role === 'applicant' && userStore.profileCompleted">
        <p class="mainHeading">Полученные предложения</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-[#1C1C1C]" v-if="offers && offers.length > 0">
            <div class="flex flex-col gap-4 p-4 rounded-xl bg-white shadow-lg" v-for="offer in offers" :key="offer.id">
                <div class="flex items-center gap-2 self-end" v-if="offer.status === 'На рассмотрении'">
                    <button type="button" @click="acceptOffer(offer.id)" class="cursor-pointer">
                        <Icon class="text-3xl text-green-500" name="material-symbols:check-rounded"/>
                    </button>
                    <button type="button" @click="rejectOffer(offer.id)" class="cursor-pointer">
                        <Icon class="text-3xl text-red-500" name="material-symbols:close-small-outline-rounded"/>
                    </button>
                </div>
                <p><span class="font-semibold font-mono">От:</span> {{ offer.employer.companyName }}</p>
                <p><span class="font-semibold font-mono">Статус:</span> {{ offer.status }}</p>
            </div>
        </div>
        <p v-else class="text-xl text-white font-semibold font-mono text-center">Нет предложений</p>
    </div>
    <div class="flex flex-col gap-6" v-if="role === 'employer' && userStore.profileCompleted">
        <p class="mainHeading">Мои предложения</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-[#1C1C1C]" v-if="offers && offers.length > 0">
            <div class="flex flex-col gap-4 p-4 rounded-xl bg-white shadow-lg" v-for="offer in offers" :key="offer.id">
                <button type="button" @click="cancelOffer(offer.id)" class="cursor-pointer self-end" v-if="offer.status === 'На рассмотрении'">
                    <Icon class="text-3xl text-red-500" name="material-symbols:delete-outline"/>
                </button>
                <p><span class="font-semibold font-mono">Резюме:</span> {{ offer.resume.name }}</p>
                <p><span class="font-semibold font-mono">Статус:</span> {{ offer.status }}</p>
                <a v-if="offer.resume.resume" :href="`https://unhdwdwoeepepaliejow.supabase.co/storage/v1/object/public/files/resumes/${offer.resume.resume}`" download="Резюме соискателя" target="_blank" class="font-semibold font-mono w-fit flex flex-col after:w-0 after:h-[3px] after:rounded-full after:bg-[#141414]/80 after:transition-all after:duration-500 hover:after:w-full">Скачать резюме</a> 
                <p v-else class="font-semibold font-mono">Ошибка: резюме не загружено</p>
            </div>
        </div>
        <div v-else class="flex flex-col w-full items-center gap-4 text-center">
            <p class="text-xl text-white font-semibold font-mono">Вы пока не отправляли предложения</p>
            <NuxtLink to="/resumes" class="px-4 py-2 border border-sky-500 bg-sky-500 text-white rounded-full text-center transition-all duration-500 hover:text-sky-500 hover:bg-transparent">Отправить предложение</NuxtLink>
        </div>
    </div>
    <div class="flex flex-col gap-6" v-if="role === 'employer' && userStore.profileCompleted">
        <p class="mainHeading">Полученные отклики</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-[#1C1C1C]" v-if="responses && responses.length > 0">
            <div class="flex flex-col gap-4 p-4 rounded-xl bg-white shadow-lg" v-for="response in responses" :key="response.id">
                <div class="flex items-center gap-2 self-end" v-if="response.status === 'На рассмотрении'">
                    <button type="button" @click="acceptResponse(response.id)" class="cursor-pointer">
                        <Icon class="text-3xl text-green-500" name="material-symbols:check-rounded"/>
                    </button>
                    <button type="button" @click="rejectResponse(response.id)" class="cursor-pointer">
                        <Icon class="text-3xl text-red-500" name="material-symbols:close-small-outline-rounded"/>
                    </button>
                </div>
                <p><span class="font-semibold font-mono">Вакансия:</span> {{ response.vacancy.name }}</p>
                <p><span class="font-semibold font-mono">Соискатель:</span> {{ response.applicant.surname }} {{ response.applicant.name }}</p>
                <p><span class="font-semibold font-mono">Статус:</span> {{ response.status }}</p>
            </div>
        </div>
        <p v-else class="text-xl text-white font-semibold font-mono text-center">Нет предложений</p>
    </div>
    <div class="flex flex-col gap-6">
        <p class="mainHeading">Выход</p>
        <button @click="logout" class="px-4 py-2 border border-sky-500 bg-sky-500 text-white rounded-full w-[160px] text-center transition-all duration-500 hover:text-sky-500 hover:bg-transparent">Выйти</button>
    </div>
</template>

<script setup>
    /* название и язык страницы */
    useSeoMeta({
        title: 'Профиль',
        lang: 'ru'
    })


    /* проверка роли и создание сообщений */
    const userStore = useUserStore()
    const { id:userId, role, updateProfileCompleted, logout } = useUserStore()
    const { showMessage } = useMessagesStore()


    /* подключение БД и роутера */
    const supabase = useSupabaseClient()


    /* загрузка и логотип */
    const isLoading = ref(false)
    const logoFile = ref(null)


    /* форма пользователя в зависимости от роли */
    const userForm = ref({
        // Общие поля
        name: '',
        // Поля для applicant
        surname: '',
        patronymic: '',
        phone: '',
        // Поля для employer
        companyName: '',
        inn: '',
        address: '',
        desc: '',
        logo: ''
    })


    /* данные профиля и их загрузка */
    const loadProfileData = async () => {
        if (role === 'applicant') {
            const { data, error } = await supabase
            .from('applicants')
            .select()
            .eq('user_id', userId)
            .single()

            if (error) throw error

            if (data) userForm.value = { ...data }
        } else if (role === 'employer') {
            const { data, error } = await supabase
            .from('employers')
            .select()
            .eq('user_id', userId)
            .single()

            if (error) throw error

            if (data) userForm.value = { ...data }
        }
    }


    /* получение логотипа */
    const getLogoUrl = (fileName) => {
        const { data } = supabase.storage.from('files/logos').getPublicUrl(fileName)
        return data.publicUrl
    }


    /* сохранение профиля */
    const saveProfile = async () => {
        isLoading.value = true

        try {
            if (role === 'applicant') {
                await saveApplicantProfile()
            } else if (role === 'employer') {
                await saveEmployerProfile()
            }
            await updateProfileCompleted()
            await loadProfileData()
            showMessage(userStore.profileCompleted ? 'Профиль обновлён!' : 'Профиль создан!', true)
        } catch (error) {
            showMessage('Ошибка при сохранении: ' + error.message, false)
        } finally {
            isLoading.value = false
        }
    }

    // соискатель 
    const saveApplicantProfile = async () => {
        if (!userStore.profileCompleted) {
            const { error } = await supabase.from('applicants').insert({
                user_id: userId,
                surname: userForm.value.surname,
                name: userForm.value.name,
                patronymic: userForm.value.patronymic,
                phone: userForm.value.phone,
            })
            if (error) throw error
        } else {
            const { error } = await supabase
                .from('applicants')
                .update({
                    surname: userForm.value.surname,
                    name: userForm.value.name,
                    patronymic: userForm.value.patronymic,
                    phone: userForm.value.phone,
                })
                .eq('user_id', userId)
            if (error) throw error
        }
    }

    //работодатель
    const saveEmployerProfile = async () => {
        let logoFileName = userForm.value.logo

        if (logoFile.value) {
            const file = logoFile.value
            const extension = file.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${extension}`

                
            const { error: uploadError } = await supabase.storage
            .from('files/logos')
            .upload(`${fileName}`, file)

            if (uploadError) throw uploadError

            logoFileName = fileName
            userForm.value.logo = fileName

        }

        if (!userStore.profileCompleted) {
            const { error } = await supabase.from('employers').insert({
                user_id: userId,
                companyName: userForm.value.companyName,
                inn: userForm.value.inn,
                address: userForm.value.address,
                desc: userForm.value.desc,
                logo: logoFileName,
            })
            if (error) throw error
        } else {
            const { error } = await supabase
                .from('employers')
                .update({
                    companyName: userForm.value.companyName,
                    inn: userForm.value.inn,
                    address: userForm.value.address,
                    desc: userForm.value.desc,
                    logo: logoFileName,
                })
                .eq('user_id', userId)
            if (error) throw error
        }
        logoFile.value = null
    }


    /* удаление логотипа */
    const removeLogoFile = async () => {
        if (!userForm.value.logo) return

        const { error: removeError } = await supabase.storage
        .from('files')
        .remove([`logos/${userForm.value.logo}`])

        // обновляем запись в базе данных
        const { error: updateError } = await supabase
        .from('employers') 
        .update({ logo: null })
        .eq('user_id', userId)

        if(!updateError && !removeError) {
            userForm.value.logo = ''
            showMessage('Логотип удалён!', true)
        } else {
            showMessage('Произошла ошибка!', false)
        }
    }


    /* настройки приватности */
    const privacyForm = ref({
        login: '',
        password: '',
        email: ''
    })

    //получение данных
    const getUserData = async () => {
        const { data:users, error:usersError } = await supabase
        .from('users')
        .select('login, password, email')
        .eq('id', userId)

        if(users) privacyForm.value = { ...users[0] }
    }

    // сохранение данных
    const updPrivacy = async() => {        
        const { error } = await supabase
        .from('users')
        .update(privacyForm.value)
        .eq('id', userId)

        if(!error) {
            showMessage('Данные обновлены!', true)
        } else {
            showMessage('Произошла ошибка!', false)
        }
    }


    /* подключение к бд и получение id, который отправил форму */
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


    /* вакансии */
    const vacancies = ref()
    const getVacanciesData = async () => {
        const { data, error } = await supabase
        .from('vacancies')
        .select()
        .eq('employer_id', mainId.value)
        .order('id', { ascending: true })
        
        if(data) vacancies.value = data
    }

    //удаление вакаснии 
    const deleteVacancy = async (vacancyId) => {
        const { error } = await supabase
        .from('vacancies')
        .delete()
        .eq('id', vacancyId)

        if(!error) {
            showMessage('Вакансия удалена!', true)
            await getVacanciesData()
        } else {
            showMessage('Произошла ошибка!', false)
        }
    }


    /* резюме */
    const resumes = ref()
    const getResumesData = async () => {
        const { data, error } = await supabase
        .from('resumes')
        .select()
        .eq('applicant_id', mainId.value)
        .order('id', { ascending: true })
        
        if(data) resumes.value = data
    }

    //удаление резюме 
    const deleteResume = async (vacancyId) => {
        const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', vacancyId)

        if(!error) {
            showMessage('Резюме удалено!', true)
            await getResumesData()
        } else {
            showMessage('Произошла ошибка!', false)
        }
    }


    /* управление откликами и предложениями */
    const responses = ref([])
    const offers = ref([])

    // фукнции для получения
    const fetchResponses = async () => {
    const { data } = await supabase
        .from('interactions')
        .select('*, vacancy:vacancies(name), applicant:applicants(name, surname)')
        .eq(role === 'applicant' ? 'applicant_id' : 'employer_id', mainId.value)
        .eq('type', 'response')
        responses.value = data || []
    }

    const fetchOffers = async () => {
    const { data } = await supabase
        .from('interactions')
        .select('*, resume:resumes(name, resume), employer:employers(companyName)')
        .eq(role === 'applicant' ? 'applicant_id' : 'employer_id', mainId.value)
        .eq('type', 'offer')
        offers.value = data || []
    }

    // функции для обработки

    const cancelResponse = async (id) => {
        await supabase.from('interactions').delete().eq('id', id)
        showMessage('Отклик удалён!', true)
        await fetchResponses()
    }

    const acceptOffer = async (id) => {
        await supabase.from('interactions').update({ status: 'Одобрено' }).eq('id', id)
        showMessage('Предложение одобрено!', true)
        await fetchOffers()
    }

    const rejectOffer = async (id) => {
        await supabase.from('interactions').update({ status: 'Отклонено' }).eq('id', id)
        showMessage('Предложение отклонено!', true)
        await fetchOffers()
    }

    const acceptResponse = async (id) => {
        await supabase.from('interactions').update({ status: 'Одобрен' }).eq('id', id)
        showMessage('Отклик одобрен!', true)
        await fetchResponses()
    }

    const rejectResponse = async (id) => {
        await supabase.from('interactions').update({ status: 'Отклонён' }).eq('id', id)
        showMessage('Отклик отклонён!', true)
        await fetchResponses()
    }

    const cancelOffer = async (id) => {
        await supabase.from('interactions').delete().eq('id', id)
        showMessage('Предложение удалено!', true)
        await fetchOffers()
    }


    /* первоначальная загрузка */
    onMounted(async () => {
        loadProfileData()
        getUserData()
        await fetchProfileData(role, userId)
        await getVacanciesData()
        await getResumesData()
        if (userStore.profileCompleted) {
            await fetchResponses()
            await fetchOffers()
        }
    })
</script>