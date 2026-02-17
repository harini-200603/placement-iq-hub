import { useRef } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Download, Award } from "lucide-react";

interface CertificateCardProps {
  userName: string;
  module: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
}

const moduleLabels: Record<string, string> = {
  aptitude: "Aptitude Preparation",
  verbal: "Verbal Ability",
  technical: "Technical Preparation",
  interview: "Interview Preparation",
  general: "General Knowledge",
};

export const CertificateCard = ({
  userName,
  module,
  score,
  totalQuestions,
  completedAt,
}: CertificateCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!ref.current) return;
    try {
      const dataUrl = await toPng(ref.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = `certificate-${module}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error("Download failed:", e);
    }
  };

  const percentage = Math.round((score / totalQuestions) * 100);
  const date = new Date(completedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-3">
      <div
        ref={ref}
        className="relative w-full aspect-[1.414/1] max-w-[600px] mx-auto rounded-xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1a365d 0%, #2d5a3d 50%, #1a365d 100%)",
          fontFamily: "'Poppins', 'Inter', sans-serif",
        }}
      >
        {/* Border frame */}
        <div
          className="absolute inset-3 rounded-lg"
          style={{
            border: "2px solid rgba(212, 175, 55, 0.6)",
          }}
        >
          <div
            className="absolute inset-2 rounded-md"
            style={{
              border: "1px solid rgba(212, 175, 55, 0.3)",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-8 py-6 text-center text-white">
          {/* Top decoration */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-[1px] bg-amber-400/60" />
            <Award className="w-6 h-6 text-amber-400" />
            <div className="w-8 h-[1px] bg-amber-400/60" />
          </div>

          <p
            className="text-[10px] uppercase tracking-[4px] text-amber-300/80 mb-1"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Certificate of Completion
          </p>

          <h2
            className="text-lg font-bold text-amber-200/90 mb-3"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            PlacementPrep Academy
          </h2>

          <p className="text-[10px] text-white/60 mb-2">
            This is to certify that
          </p>

          <h1
            className="text-2xl font-bold text-white mb-2"
            style={{
              fontFamily: "'Poppins', serif",
              textShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            {userName}
          </h1>

          <div className="w-32 h-[1px] bg-amber-400/40 mb-3" />

          <p className="text-[10px] text-white/70 mb-1 max-w-xs">
            has successfully completed the mock test in
          </p>

          <h3 className="text-sm font-semibold text-amber-300 mb-3">
            {moduleLabels[module] || module}
          </h3>

          {/* Score badge */}
          <div
            className="px-4 py-1.5 rounded-full mb-3"
            style={{
              background: "linear-gradient(135deg, rgba(212,175,55,0.3), rgba(212,175,55,0.1))",
              border: "1px solid rgba(212,175,55,0.4)",
            }}
          >
            <p className="text-xs font-bold text-amber-200">
              Score: {score}/{totalQuestions} ({percentage}%)
            </p>
          </div>

          <p className="text-[9px] text-white/50">{date}</p>

          {/* Bottom decoration */}
          <div className="flex items-center gap-3 mt-3">
            <div className="w-12 h-[1px] bg-amber-400/40" />
            <div className="w-2 h-2 rounded-full bg-amber-400/40" />
            <div className="w-12 h-[1px] bg-amber-400/40" />
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button onClick={handleDownload} variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          Download Certificate
        </Button>
      </div>
    </div>
  );
};
