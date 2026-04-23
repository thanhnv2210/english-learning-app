import { getDefaultUser } from '@/lib/db/user'
import { SettingsForm } from './settings-form'

export default async function SettingsPage() {
  const user = await getDefaultUser()
  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Settings</h1>
      <p className="text-sm text-gray-500 mb-8">Choose the target that matches your study goal.</p>
      <SettingsForm currentProfile={user.targetProfile} />
    </div>
  )
}
