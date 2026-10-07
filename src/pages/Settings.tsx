import { useAppStore } from '@/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function Settings() {
  const { settings, updateSettings, resetData } = useAppStore()
  const [key, setKey] = useState(settings.geminiApiKey || '')
  
  const [profile, setProfile] = useState({
    userName: settings.userName || '',
    courseName: settings.courseName || '',
    semester: settings.semester || ''
  })

  const handleSaveKey = () => {
    updateSettings({ geminiApiKey: key })
    alert("API Key saved securely to Local Storage.")
  }

  const handleSaveProfile = () => {
    updateSettings(profile)
    alert("Profile details saved successfully.")
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Gemini API Integration</CardTitle>
          <CardDescription className="space-y-2 mt-2">
            <p>BunkBuddy uses Google's Gemini API to generate smart attendance insights. Your key is stored securely in your browser's Local Storage.</p>
            <p>
              Don't have an API key? You can get an official, free Gemini API key from{' '}
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-medium">
                Google AI Studio
              </a>
              .
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">Gemini API Key</Label>
            <Input 
              id="api-key" 
              type="password" 
              placeholder="AIzaSy..." 
              value={key}
              onChange={(e: any) => setKey(e.target.value)}
            />
          </div>
          <Button onClick={handleSaveKey}>Save Key</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>
            Personalize your BunkBuddy experience. These details appear in the sidebar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Your Name</Label>
              <Input 
                id="userName" 
                placeholder="e.g. John Doe" 
                value={profile.userName}
                onChange={(e: any) => setProfile({ ...profile, userName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="courseName">Course Name</Label>
              <Input 
                id="courseName" 
                placeholder="e.g. CS" 
                value={profile.courseName}
                onChange={(e: any) => setProfile({ ...profile, courseName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Input 
                id="semester" 
                placeholder="e.g. Semester 5" 
                value={profile.semester}
                onChange={(e: any) => setProfile({ ...profile, semester: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={handleSaveProfile}>Save Profile</Button>
        </CardContent>
      </Card>

      <Card className="border-rose-100">
        <CardHeader>
          <CardTitle className="text-rose-600">Danger Zone</CardTitle>
          <CardDescription>
            Permanently delete all subjects, timetable, and attendance history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={() => {
            if(confirm("Are you sure? This action cannot be undone.")) resetData()
          }}>
            Reset All Data
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
