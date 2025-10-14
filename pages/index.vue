<template>
     <div class="relative w-full overflow-hidden rounded-xl">
        <img src="/images/hero/main.jpg" alt="" class="w-full aspect-video object-cover object-center max-md:aspect-[7/11]">
        <div class="absolute inset-0 bg-black/30"></div>
        <div class="absolute inset-0 py-10 px-4 flex justify-center items-center text-center text-white">
            <div v-if="isProvider" class="flex flex-col items-center relative gap-6 w-fit p-4 lg:p-6 max-w-2xl">
                <div class="absolute inset-0 backdrop-blur-md rounded-xl"></div>
                <p class="text-3xl font-mono font-semibold z-[1] max-w-lg">Публикуйте услуги и получайте заказы</p>
                <p class="opacity-70 text-lg tracking-wide z-[1] max-w-xl">
                    Создайте карточку услуги, принимайте заказы, управляйте статусами и собирайте отзывы клиентов.
                </p>
                <NuxtLink to="/profile/add-service" class="bg-sky-500 text-white rounded-lg z-[1] py-1.5 px-4 transition-all duration-500 hover:opacity-70">Добавить услугу</NuxtLink>
            </div>
            <div v-else class="flex flex-col items-center relative gap-6 w-fit p-4 lg:p-6 max-w-2xl">
                <div class="absolute inset-0 backdrop-blur-md rounded-xl"></div>
                <p class="text-3xl font-mono font-semibold z-[1] max-w-lg">Найдите проверенного исполнителя</p>
                <p class="opacity-70 text-lg tracking-wide z-[1] max-w-xl">
                    Сравнивайте предложения, оформляйте заказ и оставляйте отзывы — всё в одном месте.
                </p>
                <NuxtLink to="/services" class="bg-sky-500 text-white rounded-lg z-[1] py-1.5 px-4 transition-all duration-500 hover:opacity-70">
                    Перейти к услугам
                </NuxtLink>
            </div>
        </div>
    </div>
    <div class="flex flex-col gap-6">
        <p class="mainHeading">Как это работает</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="flex flex-col gap-6 rounded-xl bg-[#3C3C3C] p-4 items-center text-center shadow-[0px_0px_20px_-13px_black] transition-all duration-500 hover:-translate-y-2">
                <p class="px-8 py-1.5 text-3xl font-mono bg-sky-500 text-white rounded-lg">1</p>
                <p class="text-xl font-mono font-semibold text-white">Выбор услуги</p>
                <p>Найдите подходящую услугу по названию, категории, цене и рейтингу.</p>
            </div>
            <div class="flex flex-col gap-6 rounded-xl bg-[#3C3C3C] p-4 items-center text-center shadow-[0px_0px_20px_-13px_black] transition-all duration-500 hover:-translate-y-2">
                <p class="px-8 py-1.5 text-3xl font-mono bg-sky-500 text-white rounded-lg">2</p>
                <p class="text-xl font-mono font-semibold text-white">Оформление заказа</p>
                <p>Создайте заказ и отслеживайте статус: new → in_progress → done.</p>
            </div>
            <div class="flex flex-col gap-6 rounded-xl bg-[#3C3C3C] p-4 items-center text-center shadow-[0px_0px_20px_-13px_black] transition-all duration-500 hover:-translate-y-2">
                <p class="px-8 py-1.5 text-3xl font-mono bg-sky-500 text-white rounded-lg">3</p>
                <p class="text-xl font-mono font-semibold text-white">Выполнение</p>
                <p>Исполнитель принимает заказ и выполняет работу в оговорённые сроки.</p>
            </div>
            <div class="flex flex-col gap-6 rounded-xl bg-[#3C3C3C] p-4 items-center text-center shadow-[0px_0px_20px_-13px_black] transition-all duration-500 hover:-translate-y-2">
                <p class="px-8 py-1.5 text-3xl font-mono bg-sky-500 text-white rounded-lg">4</p>
                <p class="text-xl font-mono font-semibold text-white">Отзыв и рейтинг</p>
                <p>После завершения оставьте отзыв и рейтинг — помогите другим выбрать лучшее.</p>
            </div>
        </div>
    </div>
    <div class="flex flex-col gap-6">
        <p class="mainHeading">Почему это удобно</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col gap-6 items-center text-center">
                <img src="/images/advantages/1.png" alt="" class="w-full lg:w-1/2">
                <p class="text-xl font-mono font-semibold text-white">Простой старт</p>
                <p class="max-w-lg">Регистрация за минуту, профиль с аватаром, быстрый поиск или публикация услуги.</p>
            </div>
            <div class="flex flex-col gap-6 items-center text-center">
                <img src="/images/advantages/2.png" alt="" class="w-full lg:w-1/2">
                <p class="text-xl font-mono font-semibold text-white">Заказы под контролем</p>
                <p class="max-w-lg">Управляйте статусами заказов и просматривайте историю в разделе «Мои заказы».</p>
            </div>
            <div class="flex flex-col gap-6 items-center text-center">
                <img src="/images/advantages/3.png" alt="" class="w-full lg:w-1/2">
                <p class="text-xl font-mono font-semibold text-white">Честные отзывы</p>
                <p class="max-w-lg">Отзывы и рейтинг формируются только после завершённых заказов.</p>
            </div>
            <div class="flex flex-col gap-6 items-center text-center">
                <img src="/images/advantages/4.png" alt="" class="w-full lg:w-1/2">
                <p class="text-xl font-mono font-semibold text-white">Гибкость для всех</p>
                <p class="max-w-lg">Исполнители публикуют услуги, клиенты заказывают — просто и понятно.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
/* название и язык страницы */
useSeoMeta({
    title: 'Главная',
    lang: 'ru'
})


/* роль исполнителя/клиента */
const { isProvider } = useUserStore()
</script>