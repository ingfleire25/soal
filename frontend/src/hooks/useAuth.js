import { useAuthStore } from '@/stores/auth'

// Composable wrapper around the Pinia auth store
export default function useAuth() {
    const authStore = useAuthStore()
    return authStore
}

