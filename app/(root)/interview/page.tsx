import InterviewFormComponent from "@/components/InterviewForm";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { Sparkles, Zap, Target } from "lucide-react";

const Page = async () => {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col gap-10">
      {/* Header Section */}
      <div className="text-center space-y-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary-200/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="flex items-center justify-center gap-2 w-fit mx-auto px-4 py-2 bg-gradient-to-r from-primary-200/10 to-destructive-100/10 border border-primary-200/30 rounded-full">
          <Sparkles className="w-4 h-4 text-primary-200" />
          <span className="text-sm font-semibold text-primary-200">AI Interview Generator</span>
        </div>

        <h1 className="text-5xl max-sm:text-4xl font-black leading-tight">
          <span className="text-gradient-red">Create Your</span>
          <br />
          <span className="text-gradient-gold">Perfect Interview</span>
        </h1>
        
        <p className="text-light-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Our <span className="text-primary-200 font-bold">AI engine</span> generates personalized interview questions 
          based on your role, experience level, and tech stack. 
          Get ready to <span className="text-accent-100 font-bold">ace</span> your next interview!
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-dark-200 rounded-full border border-primary-200/20">
            <Target className="w-4 h-4 text-primary-200" />
            <span className="text-sm text-light-100">Tailored Questions</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-dark-200 rounded-full border border-accent-100/20">
            <Zap className="w-4 h-4 text-accent-100" />
            <span className="text-sm text-light-100">Instant Generation</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-dark-200 rounded-full border border-destructive-100/20">
            <Sparkles className="w-4 h-4 text-destructive-100" />
            <span className="text-sm text-light-100">AI-Powered</span>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <InterviewFormComponent userId={user?.id!} />
    </div>
  );
};

export default Page;
