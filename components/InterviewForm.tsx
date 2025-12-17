"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Briefcase, FileText, BarChart3, Wrench, Hash, Sparkles, Lightbulb, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const interviewSchema = z.object({
  role: z.string().min(3, "Role must be at least 3 characters"),
  type: z.enum(["Technical", "Behavioral", "Mixed"], {
    required_error: "Please select an interview type",
  }),
  level: z.enum(["Junior", "Mid-Level", "Senior"], {
    required_error: "Please select an experience level",
  }),
  techstack: z.string().min(3, "Tech stack must be at least 3 characters"),
  amount: z.coerce
    .number()
    .min(3, "Minimum 3 questions")
    .max(10, "Maximum 10 questions"),
});

type InterviewFormValues = z.infer<typeof interviewSchema>;

interface InterviewFormComponentProps {
  userId: string;
}

const InterviewFormComponent = ({ userId }: InterviewFormComponentProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<InterviewFormValues>({
    resolver: zodResolver(interviewSchema),
    defaultValues: {
      role: "",
      type: "Technical",
      level: "Mid-Level",
      techstack: "",
      amount: 5,
    },
  });

  const onSubmit = async (data: InterviewFormValues) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/vapi/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          userid: userId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(
          `Interview created successfully with ${result.questionsCount} questions!`
        );
        form.reset();
        router.push("/");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to create interview");
      }
    } catch (error) {
      console.error("Error creating interview:", error);
      toast.error("An error occurred while creating the interview");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card-border p-0.5 rounded-3xl">
        <div className="card rounded-3xl p-8 max-sm:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Role Field */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary-100 text-base font-semibold flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      Job Role
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Frontend Developer, Backend Engineer, Data Scientist"
                        className="!bg-dark-200 !rounded-xl !min-h-12 !px-5 placeholder:!text-light-400 border-light-800/30 focus-visible:border-primary-200/50 transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-light-400 text-sm">
                      Enter the position you want to practice for
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Interview Type & Level - Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary-100 text-base font-semibold flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Interview Type
                      </FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="flex h-12 w-full rounded-xl border border-light-800/30 bg-dark-200 px-5 py-2 text-base ring-offset-background placeholder:text-light-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                        >
                          <option value="Technical">Technical</option>
                          <option value="Behavioral">Behavioral</option>
                          <option value="Mixed">Mixed</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary-100 text-base font-semibold flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Experience Level
                      </FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="flex h-12 w-full rounded-xl border border-light-800/30 bg-dark-200 px-5 py-2 text-base ring-offset-background placeholder:text-light-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                        >
                          <option value="Junior">Junior</option>
                          <option value="Mid-Level">Mid-Level</option>
                          <option value="Senior">Senior</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Tech Stack Field */}
              <FormField
                control={form.control}
                name="techstack"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary-100 text-base font-semibold flex items-center gap-2">
                      <Wrench className="w-5 h-5" />
                      Tech Stack
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., React, TypeScript, Node.js, PostgreSQL"
                        className="!bg-dark-200 !rounded-xl !min-h-12 !px-5 placeholder:!text-light-400 border-light-800/30 focus-visible:border-primary-200/50 transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-light-400 text-sm">
                      Comma-separated list of technologies
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Number of Questions Field */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary-100 text-base font-semibold flex items-center gap-2">
                      <Hash className="w-5 h-5" />
                      Number of Questions
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          min={3}
                          max={10}
                          className="!bg-dark-200 !rounded-xl !min-h-12 !px-5 placeholder:!text-light-400 border-light-800/30 focus-visible:border-primary-200/50 transition-all"
                          {...field}
                        />
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-light-400 text-sm pointer-events-none">
                          3-10 questions
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription className="text-light-400 text-sm">
                      Choose between 3 and 10 interview questions
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full !bg-primary-200 !text-dark-100 hover:!bg-primary-200/80 !rounded-xl !min-h-14 !font-bold !text-base transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Generating Questions with AI...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      <span>Create Interview</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </Form>

          {/* Info Card */}
          <div className="mt-6 p-4 rounded-xl bg-dark-200/50 border border-light-800/20 flex items-center gap-3">
            <Lightbulb className="w-5 h-5 text-primary-200 flex-shrink-0" />
            <p className="text-light-400 text-sm">
              Our AI will generate customized interview questions based on your inputs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewFormComponent;
