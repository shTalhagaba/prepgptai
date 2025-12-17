import Image from "next/image";
import Link from "next/link";
import { Sparkles, TrendingUp, Target, Zap } from "lucide-react";

import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

async function Home() {
  const user = await getCurrentUser();

  const [userInterviews, allInterview] = await Promise.all([
    getInterviewsByUserId(user?.id!),
    getLatestInterviews({ userId: user?.id! }),
  ]);

  const hasPastInterviews = userInterviews?.length! > 0;
  const hasUpcomingInterviews = allInterview?.length! > 0;

  // Calculate stats
  const totalInterviews = userInterviews?.length || 0;
  const completedInterviews = userInterviews?.filter((i) => i.finalized)?.length || 0;

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-200/5 via-transparent to-destructive-100/5 pointer-events-none"></div>
        
        <div className="relative card-cta">
          <div className="flex flex-col gap-6 max-w-lg z-10">
            <div className="flex items-center gap-2 w-fit px-4 py-2 bg-primary-200/10 border border-primary-200/30 rounded-full">
              <Sparkles className="w-4 h-4 text-primary-200" />
              <span className="text-sm font-semibold text-primary-200">AI-Powered Interview Practice</span>
            </div>
            
            <h1 className="text-5xl max-sm:text-4xl font-black leading-tight">
              <span className="text-gradient-red">Master</span>
              <br />
              <span className="text-light-100">Your Next</span>
              <br />
              <span className="text-gradient-gold">Interview</span>
            </h1>
            
            <p className="text-lg text-light-400 leading-relaxed">
              Practice with <span className="text-primary-200 font-bold">AI-powered</span> mock interviews. 
              Get <span className="text-accent-100 font-bold">instant feedback</span>. 
              Ace your dream job.
            </p>

            <div className="flex gap-4 max-sm:flex-col">
              <Button asChild className="btn-primary devil-pulse max-sm:w-full group">
                <Link href="/interview" className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  <span>Start Interview</span>
                  <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </Link>
              </Button>
              
              {hasPastInterviews && (
                <Button asChild className="btn-secondary max-sm:w-full">
                  <Link href="#your-interviews">View Progress</Link>
                </Button>
              )}
            </div>
          </div>

          <div className="relative max-sm:hidden ml-8">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-200/20 to-destructive-100/20 blur-3xl"></div>
            <Image
              src="/robot.png"
              alt="AI Interview Coach"
              width={500}
              height={500}
              className="relative drop-shadow-2xl animate-float"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {hasPastInterviews && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-gradient-to-br from-dark-200 to-dark-300 rounded-xl p-6 border-2 border-primary-200/30 hover:border-primary-200 transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-light-400">Total Interviews</p>
                <p className="text-3xl font-bold text-primary-200 mt-1">{totalInterviews}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary-200/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6 text-primary-200" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-dark-200 to-dark-300 rounded-xl p-6 border-2 border-accent-100/30 hover:border-accent-100 transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-light-400">Completed</p>
                <p className="text-3xl font-bold text-accent-100 mt-1">{completedInterviews}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-accent-100/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-accent-100" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-dark-200 to-dark-300 rounded-xl p-6 border-2 border-destructive-100/30 hover:border-destructive-100 transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-light-400">Success Rate</p>
                <p className="text-3xl font-bold text-destructive-100 mt-1">
                  {totalInterviews > 0 ? Math.round((completedInterviews / totalInterviews) * 100) : 0}%
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-destructive-100/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-destructive-100" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Your Interviews Section */}
      <section className="flex flex-col gap-6 mt-12" id="your-interviews">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gradient-red text-3xl">Your Interviews</h2>
            <p className="text-light-400 mt-1">Track your progress and review feedback</p>
          </div>
          {hasPastInterviews && (
            <Button asChild className="btn-secondary max-sm:hidden">
              <Link href="/interview">+ New Interview</Link>
            </Button>
          )}
        </div>

        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
                coverImage={interview.coverImage}
              />
            ))
          ) : (
            <div className="col-span-full bg-gradient-to-br from-dark-200 to-dark-300 rounded-2xl p-12 text-center border-2 border-primary-200/30">
              <Target className="w-16 h-16 text-primary-200 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-light-100 mb-2">No Interviews Yet</h3>
              <p className="text-light-400 mb-6 max-w-md mx-auto">
                Ready to level up your interview skills? Create your first AI-powered mock interview now!
              </p>
              <Button asChild className="btn-primary devil-pulse">
                <Link href="/interview">Start Your First Interview</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Explore Interviews Section */}
      <section className="flex flex-col gap-6 mt-12">
        <div>
          <h2 className="text-gradient-gold text-3xl">Explore Interviews</h2>
          <p className="text-light-400 mt-1">Practice with curated interview scenarios</p>
        </div>

        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            allInterview?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
                coverImage={interview.coverImage}
              />
            ))
          ) : (
            <p className="text-light-400">No interviews available at the moment.</p>
          )}
        </div>
      </section>
    </>
  );
}

export default Home;
