"use client";

import { useMemo } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Target, Zap, AlertTriangle, TrendingUp, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AIAnalysis } from "@/types";

export function BountyPrediction({ analysis }: { analysis: AIAnalysis }) {
  const radarData = useMemo(() => {
    if (!analysis.impactScore) return [];
    return [
      { subject: 'User Impact', A: analysis.impactScore.userImpact, fullMark: 100 },
      { subject: 'Severity', A: analysis.impactScore.severity, fullMark: 100 },
      { subject: 'Urgency', A: analysis.impactScore.urgency, fullMark: 100 },
      { subject: 'Popularity', A: analysis.impactScore.popularity, fullMark: 100 },
    ];
  }, [analysis]);

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50 flex flex-col h-full">
      <CardHeader className="pb-2">
         <div className="flex justify-between items-start">
           <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5 text-green-500" />
              Impact & Bounty Prediction
            </CardTitle>
            <CardDescription>AI calculated impact radar</CardDescription>
           </div>
           <div className="text-right">
             <div className="text-3xl font-bold text-primary font-mono">${analysis.estimatedBounty}</div>
             <div className="text-xs text-muted-foreground">Suggested Bounty</div>
           </div>
         </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between pt-0 mt-4">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="hsl(var(--muted-foreground)/0.2)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Impact Score"
                dataKey="A"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.3}
              />
              <Tooltip 
                 contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                 itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="bg-muted/50 rounded-lg p-3 border border-border flex items-center gap-3">
             <div className="bg-background rounded-full p-2 border border-border">
               <AlertTriangle className="h-4 w-4 text-amber-500" />
             </div>
             <div>
               <div className="text-xs text-muted-foreground">Complexity</div>
               <div className="font-semibold">{analysis.complexity}</div>
             </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 border border-border flex items-center gap-3">
             <div className="bg-background rounded-full p-2 border border-border">
               <Target className="h-4 w-4 text-green-500" />
             </div>
             <div>
               <div className="text-xs text-muted-foreground">Confidence</div>
               <div className="font-semibold">{analysis.confidenceScore}%</div>
             </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
