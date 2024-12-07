import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function EventStatistic() {
  return (
    <Card className="rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-[#40514E]">Event Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative mx-auto h-48 w-48">
          <svg className="h-full w-full" viewBox="0 0 100 100">
            <circle
              className="stroke-current text-[#E4F9F5]"
              strokeWidth="10"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
            <circle
              className="stroke-current text-[#11999E]"
              strokeWidth="10"
              strokeLinecap="round"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
              strokeDasharray="251.2"
              strokeDashoffset="110"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl font-bold text-[#40514E]">56%</div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#11999E]" />
              <span className="text-sm text-[#40514E]">Music Events</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#30E3CA]" />
              <span className="text-sm text-[#40514E]">Art Exhibitions</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#40514E]" />
              <span className="text-sm text-[#40514E]">Sports Events</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#E4F9F5]" />
              <span className="text-sm text-[#40514E]">Other Events</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

