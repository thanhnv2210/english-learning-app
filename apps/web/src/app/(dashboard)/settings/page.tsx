import { getDefaultUser } from '@/lib/db/user'
import { SettingsForm } from './settings-form'

export default async function SettingsPage() {
  const user = await getDefaultUser()
  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-foreground mb-1">Settings</h1>
      <p className="text-sm text-muted-foreground mb-8">Customise your theme and study target.</p>
      <SettingsForm currentProfile={user.targetProfile} />
    </div>
  )
}
