import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Target, Award, ArrowRight, Clock } from "lucide-react";

import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";

import { cn } from "@/lib/utils";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

const InterviewCard = async ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
  coverImage = "/covers/reddit.png",
}: InterviewCardProps) => {
  const feedback =
    userId && interviewId
      ? await getFeedbackByInterviewId({
          interviewId,
          userId,
        })
      : null;

  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const badgeConfig = {
    Behavioral: { 
      color: "bg-accent-200/20 text-accent-200 border-accent-200/50",
      icon: "💬"
    },
    Mixed: { 
      color: "bg-primary-200/20 text-primary-200 border-primary-200/50",
      icon: "⚡"
    },
    Technical: { 
      color: "bg-destructive-100/20 text-destructive-100 border-destructive-100/50",
      icon: "🎯"
    },
  };

  const badge = badgeConfig[normalizedType as keyof typeof badgeConfig] || badgeConfig.Mixed;

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  const hasScore = feedback?.totalScore !== undefined;
  const scoreColor = hasScore 
    ? feedback.totalScore >= 80 ? "text-accent-100" 
    : feedback.totalScore >= 60 ? "text-primary-200" 
    : "text-destructive-100"
    : "text-light-400";

  return (
    <div className="group relative w-[360px] max-sm:w-full">
      {/* Glow effect on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-200 to-destructive-100 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-300"></div>
      
      <div className="relative bg-gradient-to-br from-dark-200 to-dark-300 rounded-2xl border-2 border-primary-200/30 group-hover:border-primary-200 transition-all duration-300 overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary-200/10 to-transparent"></div>
        
        <div className="p-6 flex flex-col gap-4">
          {/* Header with badge and cover */}
          <div className="flex items-start justify-between">
            <div className="relative">
              <div className="relative">
                <Image
                  src={coverImage}
                  alt="cover-image"
                  width={70}
                  height={70}
                  className="rounded-full object-cover size-[70px] border-2 border-primary-200/50 shadow-lg shadow-primary-200/20"
                />
                {/* Radar pulse on cover */}
                <div className="absolute inset-0 rounded-full border-2 border-primary-200 opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
              </div>
            </div>

            {/* Type Badge */}
            <div className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 backdrop-blur-sm",
              badge.color
            )}>
              <span>{badge.icon}</span>
              <span>{normalizedType}</span>
            </div>
          </div>

          {/* Role Title */}
          <div>
            <h3 className="text-xl font-bold text-light-100 capitalize line-clamp-1 group-hover:text-primary-200 transition-colors">
              {role}
            </h3>
            <p className="text-sm text-light-400 mt-1">Interview Session</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Date */}
            <div className="flex items-center gap-2 bg-dark-100/50 rounded-lg px-3 py-2 border border-primary-200/20">
              <Calendar className="w-4 h-4 text-primary-200" />
              <div className="flex flex-col">
                <span className="text-xs text-light-400">Date</span>
                <span className="text-xs font-semibold text-light-100">{formattedDate}</span>
              </div>
            </div>

            {/* Score */}
            <div className="flex items-center gap-2 bg-dark-100/50 rounded-lg px-3 py-2 border border-primary-200/20">
              <Award className={cn("w-4 h-4", scoreColor)} />
              <div className="flex flex-col">
                <span className="text-xs text-light-400">Score</span>
                <span className={cn("text-xs font-bold", scoreColor)}>
                  {hasScore ? `${feedback.totalScore}/100` : "Not Taken"}
                </span>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="flex items-center gap-2 py-2">
            <DisplayTechIcons techStack={techstack} />
          </div>

          {/* Description/Feedback */}
          <p className="text-sm text-light-400 line-clamp-2 min-h-[40px]">
            {feedback?.finalAssessment ||
              "Ready to showcase your skills? Take this interview to get detailed AI feedback."}
          </p>

          {/* Action Button */}
          <Button 
            asChild 
            className="w-full !bg-gradient-to-r from-primary-200 to-primary-300 hover:from-primary-300 hover:to-destructive-200 !text-white !rounded-xl !font-bold !min-h-12 transition-all duration-300 border-0 shadow-lg shadow-primary-200/30 hover:shadow-xl hover:shadow-primary-200/50 group/btn"
          >
            <Link
              href={
                feedback
                  ? `/interview/${interviewId}/feedback`
                  : `/interview/${interviewId}`
              }
              className="flex items-center justify-center gap-2"
            >
              <Target className="w-5 h-5" />
              <span>{feedback ? "View Feedback" : "Start Interview"}</span>
              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Progress indicator for completed interviews */}
        {hasScore && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-dark-400">
            <div 
              className="h-full bg-gradient-to-r from-primary-200 to-accent-100 transition-all duration-500"
              style={{ width: `${feedback.totalScore}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewCard;
