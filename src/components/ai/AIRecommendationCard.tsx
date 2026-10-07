import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react'

export function AIRecommendationCard({ title, message, type }: { title: string, message: string, type: 'safe' | 'warning' | 'info' }) {
  
  const iconMap = {
    safe: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
    warning: <AlertCircle className="w-5 h-5 text-rose-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />,
  }

  const bgMap = {
    safe: 'bg-emerald-50 border-emerald-100',
    warning: 'bg-rose-50 border-rose-100',
    info: 'bg-blue-50 border-blue-100',
  }

  return (
    <Card className={`overflow-hidden border ${bgMap[type]}`}>
      <CardContent className="p-4 flex gap-4 items-start">
        <div className="mt-0.5">
          {iconMap[type]}
        </div>
        <div>
          <h4 className="font-semibold text-slate-900">{title}</h4>
          <p className="text-sm text-slate-700 mt-1 leading-relaxed">{message}</p>
        </div>
      </CardContent>
    </Card>
  )
}
