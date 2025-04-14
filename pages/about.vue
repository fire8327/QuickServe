<template>
      <div class="flex flex-col gap-6">
        <p class="mainHeading">О компании</p>
        <div class="flex max-lg:flex-col gap-6 w-full">
            <p class="w-full lg:w-1/2">Мы — команда, которая меняет подход к поиску работы и найму. <br>
                Наша миссия — упростить путь к идеальной работе. Мы верим, что каждый заслуживает возможности найти место,
                где его ценят, поддерживают и помогают расти. Поэтому мы создали платформу, которая соединяет талантливых
                специалистов с компаниями, ищущими именно таких людей.
            </p>
            <img src="/images/about/main.jpg" alt="" class="rounded-xl object-cover aspect-video w-full lg:w-1/2">
        </div>
        <ul class="flex flex-col gap-4 list-inside list-disc marker:text-sky-500">
            <span class="text-xl font-semibold font-mono text-white">Что мы делаем</span>
            <li>Для соискателей - 
                предоставляем удобный поиск вакансий, персонализированные рекомендации, подсказки по составлению резюме и возможность откликнуться в один клик.</li>
            <li>Для работодателей - 
                предлагаем простой способ размещения вакансий и доступ к базе кандидатов, готовых к новым вызовам.</li>
        </ul>
        <ul class="flex flex-col gap-4 list-inside list-disc marker:text-sky-500">
            <span class="text-xl font-semibold font-mono text-white">Почему выбирают нас</span>
            <li>Современный и интуитивно понятный интерфейс</li>
            <li>Только актуальные вакансии</li>
            <li>Cистема фильтрации</li>
            <li>Поддержка на каждом этапе</li>
        </ul>
    </div>
    <div class="flex gap-6 max-lg:flex-col">
        <div class="lg:w-1/3 flex flex-col gap-4">
            <p class="mainHeading">Контакты</p>
            <div class="flex flex-col gap-2">
                <p class="text-base">Адрес</p>
                <p class="text-xl font-semibold font-mono text-white">улица Пушкина, дом 1</p>
            </div>
            <div>
                <p class="text-base">Режим работы</p>
                <p class="mt-2 text-xl font-semibold font-mono text-white">Пн-Пт: с 9:00 до 21:00</p>
                <p class="text-xl font-semibold font-mono text-white">Cб-Вс: с 12:00 до 18:00</p>
            </div>
            <div class="flex flex-col gap-2">
                <p class="text-base">Email</p>
                <NuxtLink to="mailto:jobsearch@mail.ru"
                    class="text-xl font-semibold font-mono text-white transition-all duration-500 hover:text-sky-500">
                    jobsearch@mail.ru</NuxtLink>
            </div>
            <div class="flex flex-col gap-2">
                <p class="text-base">Телефон для связи</p>
                <NuxtLink to="tel:8 800-555-35-35"
                    class="text-xl font-semibold font-mono text-white transition-all duration-500 hover:text-sky-500">8
                    800-555-35-35</NuxtLink>
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
        <iframe class="w-full h-[400px] lg:w-2/3 rounded-xl border border-gray-300 shadow-md"
            src="https://yandex.ru/map-widget/v1/?um=constructor%3Ab5b71122d59bf321fa1fb00171146b95ba02bcfc87108b9fa87ff29b94af771d&amp;source=constructor"
            frameborder="0"></iframe>
    </div>
</template>

<script setup>

</script>