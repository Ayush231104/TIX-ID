'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LuUser, LuLogOut } from 'react-icons/lu'
import { createClient } from '@/utils/supabase/client'
import ProfileForm from '@/components/profile/ProfileForm'
import Typography from '@/components/ui/Typography'
import ConfirmModal from '@/components/ui/ConfirmModal'

type ProfileTab = 'account' | 'tickets'

const supabase = createClient()

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('account')
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.log(error)
    }
    setShowLogoutModal(false)
    router.refresh()
    router.push('/')
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)]">
      {/* Sidebar */}
      <div className="hidden md:block md:w-[320px] shrink-0 bg-[#F5F6F8] border-b md:border-b-0 md:border-r border-shade-200">
        <div className="flex flex-col  md:sticky md:top-20 md:py-4 z-10">
          {/* Account Details Button */}
          <button
            onClick={() => setActiveTab('account')}
            className={`flex items-center justify-center md:justify-start gap-2 sm:gap-4 flex-1 md:w-full px-2 sm:px-6 md:px-8 py-4 transition-colors
              ${activeTab === 'account'
                ? 'bg-white text-sky-blue shadow-sm'
                : 'text-shade-600 hover:bg-white/50'}`}
          >
            <LuUser className="text-[18px] sm:text-xl shrink-0" />
            <div className="truncate">
              <Typography variant="h4" color="shade-900">
                Account Details
              </Typography>
            </div>
          </button>

          {/* Logout Button */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center justify-center md:justify-start gap-2 sm:gap-4 flex-1 md:w-full px-2 sm:px-6 md:px-8 py-4 transition-colors text-shade-600 hover:bg-white/50"
          >
            <LuLogOut className="text-[18px] sm:text-xl shrink-0" />
            <div className="truncate">
              <Typography variant="h4" color="shade-900">
                Logout
              </Typography>
            </div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-12 lg:px-20 bg-white min-w-0">
        <Typography variant="h3" color="shade-900" className="mb-2">
          My Profile
        </Typography>
        <Typography color="shade-600" className="mb-8">
          Manage your account details and personal information
        </Typography>

        {activeTab === 'account' && <ProfileForm />}
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <ConfirmModal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
          title="Are you sure you want to logout?"
          description="You will be securely signed out of your TIX ID account."
          confirmText="Logout"
        />
      )}
    </div>
  )
}
