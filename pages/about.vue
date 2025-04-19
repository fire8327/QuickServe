<template>
    <!-- Секция "О компании" (первые элементы) -->
    <div class="flex flex-col lg:flex-row gap-6">
        <div class="flex flex-col gap-6 lg:w-1/2">
            <p class="mainHeading">О компании</p>
            <p class="w-full">
                Мы — команда, которая меняет подход к поиску работы и найму. <br />
                Наша миссия — упростить путь к идеальной работе. Мы верим, что каждый заслуживает возможности найти
                место, где его ценят, поддерживают и помогают расти. Поэтому мы создали платформу, которая соединяет
                талантливых специалистов с компаниями, ищущими именно таких людей.
            </p>
        </div>
        <div class="relative lg:w-1/2">
            <img src="/images/about/main.jpg" alt="" class="rounded-xl object-cover aspect-video w-full lg:h-full" />
            <p class="hidden lg:block absolute bottom-0 right-0 w-3/4 bg-[#2C2C2C]/90 p-4 rounded-xl text-white">
                Мы соединяем таланты и компании для создания идеальных рабочих мест.
            </p>
        </div>
    </div>

    <!-- Секция списков (средние элементы) -->
    <div class="grid gap-4 lg:grid-cols-2">
        <ul class="flex flex-col gap-4 list-inside list-disc marker:text-sky-500 bg-[#2C2C2C] p-4 rounded-xl shadow-lg">
            <span class="text-xl font-semibold font-mono text-white">Что мы делаем</span>
            <li>Для соискателей - предоставляем удобный поиск вакансий, персонализированные рекомендации, подсказки по
                составлению резюме и возможность откликнуться в один клик.</li>
            <li>Для работодателей - предлагаем простой способ размещения вакансий и доступ к базе кандидатов, готовых к
                новым вызовам.</li>
        </ul>
        <ul class="flex flex-col gap-4 list-inside list-disc marker:text-sky-500 bg-[#2C2C2C] p-4 rounded-xl shadow-lg">
            <span class="text-xl font-semibold font-mono text-white">Почему выбирают нас</span>
            <li>Современный и интуитивно понятный интерфейс</li>
            <li>Только актуальные вакансии</li>
            <li>Cистема фильтрации</li>
            <li>Поддержка на каждом этапе</li>
        </ul>
    </div>

    <!-- Секция "Контакты" (последние элементы) -->
    <div class="relative flex flex-col gap-6">
        <iframe class="w-full h-[400px] rounded-xl border border-gray-300 shadow-md lg:h-[500px]"
            src="https://yandex.ru/map-widget/v1/?um=constructor%3Ab5b71122d59bf321fa1fb00171146b95ba02bcfc87108b9fa87ff29b94af771d&source=constructor"
            frameborder="0"></iframe>
        <div
            class="flex flex-col gap-4 lg:w-3/4 lg:mx-auto lg:-mt-16 lg:bg-[#2C2C2C] lg:p-6 lg:rounded-xl lg:shadow-lg">
            <p class="mainHeading">Контакты</p>
            <div class="flex flex-col lg:flex-row lg:flex-wrap gap-4 lg:gap-6">
                <div class="flex flex-col gap-2">
                    <p class="text-base">Адрес</p>
                    <p class="text-xl font-semibold font-mono text-white">улица Пушкина, дом 1</p>
                </div>
                <div class="flex flex-col gap-2">
                    <p class="text-base">Режим работы</p>
                    <p class="mt-2 text-xl font-semibold font-mono text-white">Пн-Пт: с 9:00 до 21:00</p>
                    <p class="text-xl font-semibold font-mono text-white">Cб-Вс: с 12:00 до 18:00</p>
                </div>
                <div class="flex flex-col gap-2">
                    <p class="text-base">Email</p>
                    <NuxtLink to="mailto:quickserve@mail.ru"
                        class="text-xl font-semibold font-mono text-white transition-all duration-500 hover:text-sky-500">
                        quickserve@mail.ru</NuxtLink>
                </div>
                <div class="flex flex-col gap-2">
                    <p class="text-base">Телефон для связи</p>
                    <NuxtLink to="tel:8 800-555-35-35"
                        class="text-xl font-semibold font-mono text-white transition-all duration-500 hover:text-sky-500">
                        8 800-555-35-35</NuxtLink>
                </div>
                <div class="flex items-center gap-2">
                    <NuxtLink to="/" target="_blank" class="transition-all duration-500 hover:text-sky-500">
                        <Icon class="text-3xl" name="mdi:vk" />
                    </NuxtLink>
                    <NuxtLink to="/" target="_blank" class="transition-all duration-500 hover:text-sky-500">
                        <Icon class="text-3xl" name="ic:baseline-telegram" />
                    </NuxtLink>
                    <NuxtLink to="/" target="_blank" class="transition-all duration-500 hover:text-sky-500">
                        <Icon class="text-3xl" name="basil:instagram-outline" />
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
/* название и язык страницы */
useSeoMeta({
    title: 'О компании',
    lang: 'ru'
})
</script>