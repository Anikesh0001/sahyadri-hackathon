"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { Target, Zap, Users as UsersIcon, Bug } from "lucide-react";

const trendData = [
  { month: 'Jan', resolved: 45, reported: 65 },
  { month: 'Feb', resolved: 52, reported: 58 },
  { month: 'Mar', resolved: 78, reported: 80 },
  { month: 'Apr', resolved: 110, reported: 95 },
  { month: 'May', resolved: 145, reported: 120 },
  { month: 'Jun', resolved: 180, reported: 140 },
];

const distributionData = [
  { name: 'Critical', value: 15, color: 'hsl(var(--destructive))' },
  { name: 'High', value: 35, color: 'hsl(var(--primary))' },
  { name: 'Medium', value: 40, color: 'hsl(var(--amber-500))' },
  { name: 'Low', value: 10, color: 'hsl(var(--green-500))' },
];

const developerPerformance = [
  { name: 'React/Next.js', bounties: 4500 },
  { name: 'Node.js', bounties: 3800 },
  { name: 'Python/AI', bounties: 6200 },
  { name: 'DevOps', bounties: 2900 },
  { name: 'Smart Contracts', bounties: 8100 },
];

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Platform Analytics</h1>
        <p className="text-muted-foreground mt-1">Global insights into bug resolution, crowdfunding trends, and AI accuracy.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-8">
        {[
          { title: "Total Bounties Paid", value: "$142,500", icon: <Zap className="h-4 w-4 text-green-500" /> },
          { title: "Bugs Resolved", value: "3,842", icon: <Bug className="h-4 w-4 text-primary" /> },
          { title: "Active Developers", value: "854", icon: <UsersIcon className="h-4 w-4 text-blue-500" /> },
          { title: "AI Match Accuracy", value: "94.2%", icon: <Target className="h-4 w-4 text-purple-500" /> },
        ].map((stat, i) => (
          <Card key={i} className="bg-card/40 backdrop-blur border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mb-6">
        <Card className="lg:col-span-4 bg-card/40 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle>Bug Resolution Trends</CardTitle>
            <CardDescription>Comparison of reported vs. AI-resolved bugs over time.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorReported" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="reported" stroke="hsl(var(--muted-foreground))" fillOpacity={1} fill="url(#colorReported)" name="Reported" />
                  <Area type="monotone" dataKey="resolved" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorResolved)" name="Resolved" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 bg-card/40 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle>Severity Distribution</CardTitle>
            <CardDescription>Breakdown of bugs by priority level.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-7 bg-card/40 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle>Bounty Payouts by Category</CardTitle>
            <CardDescription>Total funds distributed per technology stack.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={developerPerformance} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} width={120} />
                  <Tooltip 
                    cursor={{fill: 'hsl(var(--muted)/0.5)'}}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    formatter={(value) => [`$${value}`, 'Total Bounties']}
                  />
                  <Bar dataKey="bounties" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
