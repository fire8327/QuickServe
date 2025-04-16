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

    // обновление профиля
    async function updateProfileCompleted() {
        const { data, error } = await supabase
          .from('users')
          .select('role, applicants (user_id), employers (user_id)')
          .eq('id', id.value)
    
        if (!error) {
          profileCompleted.value =
            data[0].role === 'applicant' ? !!data[0].applicants[0]?.user_id :
            data[0].role === 'employer' ? !!data[0].employers[0]?.user_id : false
        }
      }

    return { authenticated, id, role, profileCompleted, login, logout, updateProfileCompleted }
})