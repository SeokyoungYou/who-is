import { QuizType } from "@/lib/quiz/type";
import { Badge } from "./ui/badge";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  quizType: QuizType;
}

export default function QuizBadge({ quizType, ...props }: BadgeProps) {
  const getBadgeColor = (quizType: QuizType): string => {
    switch (quizType) {
      case QuizType.EASY:
        return "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800";
      case QuizType.NORMAL:
        return "bg-gradient-to-r from-purple-400 to-purple-500 text-white";
      case QuizType.HARD:
        return "bg-gradient-to-r from-purple-600 to-purple-700 text-white";
      case QuizType.SUPER_HARD:
        return "bg-gradient-to-r from-purple-800 to-purple-900 text-white";
      default:
        return "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800";
    }
  };

  return (
    <Badge
      className={`rounded-full border-none px-4 py-1 text-sm ${getBadgeColor(
        quizType
      )}`}
      {...props}
    />
  );
}
