import { LucideIcon } from "lucide-react";

interface PatternCardProps {
  title: React.ReactNode;
  icon: LucideIcon;
  description: React.ReactNode;
}
export default function PatternCard({
  title,
  icon: Icon,
  description,
}: PatternCardProps) {
  return (
    <div className="flex gap-3">
      <div className="bg-muted text-muted-foreground flex h-fit items-center rounded p-2">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex flex-col">
        <span className="text-muted-foreground text-xs">{title}</span>
        <span className="text-sm font-medium">{description}</span>
      </div>
    </div>
  );
}
