import { cn } from "@/lib/utils";

interface ProgressLineProps {
    progress: number; // 0 to 100
    className?: string;
    colorClass?: string;
}

export default function ProgressLine({ progress, className, colorClass }: ProgressLineProps) {
    return (
        <div className={cn("w-full h-2 bg-gray-100 rounded-full overflow-hidden", className)}>
            <div
                className={cn("h-full bg-black transition-all duration-500 ease-in-out", colorClass)}
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
