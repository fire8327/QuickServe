// вспомогательные функции для работы с cookies
function useSynchronizedCookie(key, defaultValue) {
    const cookie = useCookie(key)
    const state = ref(cookie.value || defaultValue)

    watch(state, (newValue) => {
        cookie.value = newValue
    })

    return state
}

// хранилище состояния пользователя
export const useUserStore = defineStore("user", () => {
    const authenticated = useSynchronizedCookie('authenticated', false)
    const id = useSynchronizedCookie('id', null)
    const role = useSynchronizedCookie('role', null)
    const profileCompleted = useSynchronizedCookie('profileCompleted', false);

    /* сообщения и роутер */
    const { showMessage } = useMessagesStore()
    const router = useRouter()
    const supabase = useSupabaseClient()

    // функции для входа и выхода из аккаунта
    function login(userId, userRole, isProfileCompleted) {
        authenticated.value = true
        id.value = userId
        role.value = userRole
        profileCompleted.value = isProfileCompleted
    }

    function logout() {
        authenticated.value = false
        id.value = null
        role.value = null
        profileCompleted.value = false
        showMessage("Успешный выход", true)
        router.push("/")
    }

    // аутентификация
    async function signIn(login, password) {
        const { data: users, error } = await supabase
          .from('users')
          .select('*')
          .eq('login', login)

        if (error) {
          console.error('Ошибка БД:', error)
          return showMessage('Произошла ошибка при входе', false)
        }

        if (!users || users.length === 0) {
          return showMessage('Пользователь не найден', false)
        }

        if (users[0].password !== password) {
          return showMessage('Неверный пароль', false)
        }

        const isProfileCompleted = !!(users[0].first_name && users[0].last_name && users[0].phone)
        login(users[0].id, users[0].is_provider, isProfileCompleted)
        showMessage("Успешный вход", true)
        return users[0]
    }

    // регистрация
    async function signUp(userData) {
        // Проверяем, существует ли пользователь с таким логином
        const { data: existingUsers, error: checkError } = await supabase
            .from('users')
            .select('id')
            .eq('login', userData.login)

        if (checkError) {
            console.error('Ошибка проверки логина:', checkError)
            return showMessage('Произошла ошибка при регистрации', false)
        }

        if (existingUsers && existingUsers.length > 0) {
            return showMessage('Пользователь с таким логином уже существует', false)
        }

        // Создаем нового пользователя
        const { data, error } = await supabase
            .from('users')
            .insert({
                login: userData.login,
                password: userData.password,
                first_name: userData.first_name,
                last_name: userData.last_name,
                patronymic: userData.patronymic,
                phone: userData.phone,
                is_provider: userData.is_provider || false
            })
            .select()
            .single()
        
        if (error) {
            console.error('Ошибка регистрации:', error)
            return showMessage('Ошибка регистрации', false)
        }
        
        login(data.id, data.is_provider, false)
        showMessage("Успешная регистрация", true)
        return data
    }

    // обновление профиля
    async function updateProfileCompleted() {
        const { data, error } = await supabase
          .from('users')
          .select('first_name, last_name, phone')
          .eq('id', id.value)
    
        if (!error && data) {
          profileCompleted.value = !!(data.first_name && data.last_name && data.phone)
        }
      }

    return { authenticated, id, role, profileCompleted, login, logout, signIn, signUp, updateProfileCompleted }
})