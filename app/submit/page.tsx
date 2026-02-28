"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import { useBugStore } from "@/store/useBugStore";
import { api } from "@/services/api";
import { Bug } from "@/types";
import { AIAnalysisPanel } from "@/features/bug-submission/AIAnalysisPanel";
import { toast } from "sonner";

export default function SubmitBugPage() {
  const { user } = useAuthStore();
  const { addBug } = useBugStore();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBug, setSubmittedBug] = useState<Bug | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    repoLink: "",
    logs: "",
    expectedBehavior: "",
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to submit a bug.");
      return;
    }

    setIsSubmitting(true);
    toast.info("Submitting bug report to AI engine...");
    try {
      // Simulate generic tags extraction internally via API stub
      const newBug = await api.submitBug({
        ...formData,
        tags: ["auto-tag", "frontend"], 
        severity: "High",
        authorId: user.id,
      });
      addBug(newBug);
      setSubmittedBug(newBug);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedBug) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-12 md:py-20">
        <AIAnalysisPanel bug={submittedBug} />
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Report a Bug Bounty</h1>
        <p className="text-muted-foreground">
          Provide detailed information about the issue. Our AI will analyze your report, estimate complexity, and recommend a bounty amount to attract the right developers.
        </p>
      </div>

      <Card className="bg-card w-full mb-10 border-border/50">
        <CardHeader>
          <CardTitle>Bug Details</CardTitle>
          <CardDescription>All fields are necessary for optimal AI matchmaking.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Issue Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. infinite redirect loop on dashboard"
                required
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="repoLink">GitHub Repository Link</Label>
              <Input
                id="repoLink"
                name="repoLink"
                type="url"
                placeholder="https://github.com/organization/repo"
                required
                value={formData.repoLink}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Explain the steps to reproduce, what you tried, and the context..."
                className="min-h-[120px]"
                required
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedBehavior">Expected Behavior</Label>
              <Input
                id="expectedBehavior"
                name="expectedBehavior"
                placeholder="What should happen instead?"
                required
                value={formData.expectedBehavior}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logs">Error Logs or Stack Trace (Optional)</Label>
              <Textarea
                id="logs"
                name="logs"
                placeholder="Paste your console logs, terminal output, or stack traces here..."
                className="min-h-[80px] font-mono text-sm"
                value={formData.logs}
                onChange={handleChange}
              />
            </div>

            <div className="pt-4 flex justify-end gap-4">
              <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting} className="min-w-[200px]">
                {isSubmitting ? "Submitting..." : "Submit to AI Analysis"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
