import { LogOut } from 'lucide-react'
import { useAuthStore } from '../../stores/useAuthStore'
import { useNavigate } from 'react-router'

const LogoutButton = () => {
    const { logout } = useAuthStore()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await logout()
            navigate('/signin')
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#64748B] hover:text-red-500 px-4 py-2 rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50"
        >
            <LogOut className="h-4 w-4" />
            <span>Đăng xuất</span>
        </button>
    )
}

export default LogoutButton
