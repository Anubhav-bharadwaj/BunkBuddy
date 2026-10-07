import { useState } from 'react'
import { useAppStore } from '@/store'
import { AIRecommendationCard } from '@/components/ai/AIRecommendationCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, RefreshCw, AlertTriangle } from 'lucide-react'
import { GoogleGenAI } from '@google/genai'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { calculateSimulatedAttendance, calculateOverallAttendance } from '@/lib/attendance'

function VelocityChart() {
  const { subjects, settings, libraryAttendance } = useAppStore()
  
  // Generate projection data: next 20 classes
  const data = []
  for (let i = 0; i <= 20; i++) {
    const simAttendAll = calculateSimulatedAttendance(subjects.map(s => ({...s, attendedClasses: s.attendedClasses + (s.attendedClasses/s.totalClasses || 0)})), i, libraryAttendance) // roughly simulating attending all
    const simSkipAll = calculateSimulatedAttendance(subjects, i, libraryAttendance)
    
    // To properly simulate attending all, we just add `i` to both total and attended.
    // Wait, the subjects array total classes doesn't matter, just aggregate does.
    const totalCurrent = subjects.reduce((sum, s) => sum + s.totalClasses, 0)
    const attendedCurrent = subjects.reduce((sum, s) => sum + s.attendedClasses, 0)
    
    let bonus = 0
    if (libraryAttendance.held > 0) {
      bonus = Math.round(((libraryAttendance.present / libraryAttendance.held) * 100 * 0.1) * 100) / 100
    }

    const attendAllBase = totalCurrent + i === 0 ? 0 : Math.round(((attendedCurrent + i) / (totalCurrent + i)) * 10000) / 100
    const skipAllBase = totalCurrent + i === 0 ? 0 : Math.round((attendedCurrent / (totalCurrent + i)) * 10000) / 100

    data.push({
      classes: i,
      attendAll: Math.round((attendAllBase + bonus) * 100) / 100,
      skipAll: Math.round((skipAllBase + bonus) * 100) / 100
    })
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis 
          dataKey="classes" 
          tickLine={false} 
          axisLine={false} 
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          dy={10}
        />
        <YAxis 
          domain={['auto', 'auto']} 
          tickLine={false} 
          axisLine={false} 
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          dx={-10}
        />
        <Tooltip 
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          labelFormatter={(val) => `Next ${val} classes`}
        />
        <ReferenceLine y={settings.targetAttendance} stroke="#ef4444" strokeDasharray="3 3" />
        <Line 
          type="monotone" 
          dataKey="attendAll" 
          name="If Attended"
          stroke="#10b981" 
          strokeWidth={3}
          dot={false}
          activeDot={{ r: 6, fill: '#10b981', strokeWidth: 0 }}
        />
        <Line 
          type="monotone" 
          dataKey="skipAll" 
          name="If Skipped"
          stroke="#f43f5e" 
          strokeWidth={3}
          dot={false}
          activeDot={{ r: 6, fill: '#f43f5e', strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function AIRecovery() {
  const { subjects, timetable, settings, aiInsight, setAIInsight, libraryAttendance } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateInsights = async () => {
    if (!settings.geminiApiKey) {
      setError("Please add your Gemini API key in Settings first.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const ai = new GoogleGenAI({ apiKey: settings.geminiApiKey })
      
      const currentPercentage = calculateOverallAttendance(subjects, libraryAttendance)

      const payload = {
        subjects,
        timetable,
        targetAttendance: settings.targetAttendance,
        currentOverallPercentage: currentPercentage,
        libraryAttendance
      }

      const prompt = `
        You are an AI Attendance Advisor for a college student. 
        Analyze the following student data and provide 3-4 concise, helpful, student-focused recommendations. 
        CRITICAL RULE: In this college, individual subject attendance DOES NOT MATTER. ONLY the overall aggregate attendance matters for the ${settings.targetAttendance}% requirement. 
        The student's exact current overall aggregate attendance is ${currentPercentage}%.
        Do not tell the user they are falling behind in a specific subject if their overall attendance is safe. 
        Instead, look at their timetable and recommend the smartest days or specific subjects to skip (e.g. subjects with long, boring lectures or days with fewer classes) to optimize their time without dipping the overall aggregate below ${settings.targetAttendance}%.
        DO NOT include any pleasantries or chatbot text. Output raw JSON ONLY.
        The JSON must match this structure:
        {
          "recommendations": [
            { "title": "Short title", "message": "Detailed message", "type": "safe" | "warning" | "info" }
          ]
        }
        
        Data:
        ${JSON.stringify(payload)}
      `

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      })

      const text = response.text || ''
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        setAIInsight({
          recommendations: parsed.recommendations,
          generatedAt: Date.now()
        })
      } else {
        throw new Error("Invalid response format from AI")
      }
      
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to generate insights. Check your API key.")
    } finally {
      setLoading(false)
    }
  }

  const isStale = aiInsight ? (Date.now() - aiInsight.generatedAt) > 24 * 60 * 60 * 1000 : true

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-blue-600" />
            Attendance Intelligence & Recovery Studio
          </h2>
          <p className="text-slate-500 mt-1">Algorithmic schedule synthesis and predictive failure risks</p>
        </div>
        <Button 
          onClick={generateInsights} 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? (
            <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Generating...</>
          ) : (
            <><Sparkles className="w-4 h-4 mr-2" /> Re-evaluate Insights</>
          )}
        </Button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-lg flex items-center gap-3">
          <AlertTriangle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-800 border-b pb-2">Strategic Advisor</h3>
          
          {!aiInsight ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
              <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No insights generated yet. Click re-evaluate to analyze your attendance.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {isStale && (
                <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded text-center font-medium">
                  These insights are older than 24 hours and might be outdated.
                </p>
              )}
              {aiInsight.recommendations.map((rec: any, idx: number) => (
                <AIRecommendationCard 
                  key={idx} 
                  title={rec.title} 
                  message={rec.message} 
                  type={rec.type as any} 
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-800 border-b pb-2">Recovery Simulator</h3>
          <Card>
            <CardHeader>
              <CardTitle>Attendance Velocity</CardTitle>
              <CardDescription>Mathematical turnaround modeling for safe boundaries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 mt-4">
                <VelocityChart />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
