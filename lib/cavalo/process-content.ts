import {
  Bell,
  CreditCard,
  FileText,
  Shield,
  Truck,
  UserCheck,
  type LucideIcon,
} from "lucide-react";

export interface ProcessStep {
  id: number;
  icon: LucideIcon;
  title: string;
  caption: string;
  description: string;
  shareLine: string;
  accent: string;
  timestamp: number;
}

/** Drop your full-process animation at `public/videos/cavalo-process.mp4` */
export const PROCESS_ANIMATION_VIDEO = "/videos/cavalo-process.mp4";

export const PROCESS_ANIMATION_FALLBACK =
  "https://videos.pexels.com/video-files/4364226/4364226-uhd_2560_1440_30fps.mp4";

export const PROCESS_STEPS: ProcessStep[] = [
  {
    id: 1,
    icon: UserCheck,
    title: "Register & Book",
    caption: "Sign up with mobile OTP and select your truck in under 60 seconds.",
    description:
      "Create your account with your mobile number. Choose brand, GVW category, date, city and time slot — all in one quick flow.",
    shareLine: "Book your truck inspection in 60 seconds",
    accent: "from-amber-500/20 to-orange-600/10",
    timestamp: 0,
  },
  {
    id: 2,
    icon: CreditCard,
    title: "Secure Payment",
    caption: "Pay via UPI, card or WhatsApp — secured by Razorpay.",
    description:
      "Razorpay checkout, WhatsApp payment link, or bank transfer. Apply fleet coupons like FLEET20 at checkout.",
    shareLine: "Pay securely with UPI, card or WhatsApp",
    accent: "from-emerald-500/20 to-teal-600/10",
    timestamp: 12,
  },
  {
    id: 3,
    icon: Bell,
    title: "WhatsApp Confirmed",
    caption: "Instant WhatsApp confirmation with your booking reference.",
    description:
      "Official WhatsApp Business message with reference, inspection date, city and time slot — no waiting on calls.",
    shareLine: "Instant booking confirmation on WhatsApp",
    accent: "from-green-500/20 to-emerald-600/10",
    timestamp: 24,
  },
  {
    id: 4,
    icon: Shield,
    title: "Inspector Assigned",
    caption: "Nearest certified engineer dispatched to your truck location.",
    description:
      "We match the closest certified inspector. You get their name, rating and direct number on WhatsApp.",
    shareLine: "Certified inspector assigned near you",
    accent: "from-blue-500/20 to-indigo-600/10",
    timestamp: 36,
  },
  {
    id: 5,
    icon: Truck,
    title: "150+ Point Check",
    caption: "Engine, chassis, tyres, electricals, cabin and documents checked.",
    description:
      "Comprehensive 150+ point inspection with photos at every checkpoint using our partner inspector app.",
    shareLine: "150+ point truck inspection on-site",
    accent: "from-violet-500/20 to-purple-600/10",
    timestamp: 48,
  },
  {
    id: 6,
    icon: FileText,
    title: "Report on WhatsApp",
    caption: "PDF report with score, photos and recommendations in 30 minutes.",
    description:
      "Full report on WhatsApp: overall score, category breakdown, photo gallery and pass/fail checklist.",
    shareLine: "Detailed report delivered on WhatsApp",
    accent: "from-cavalo-yellow/30 to-amber-600/10",
    timestamp: 60,
  },
];

export const STEP_DURATION_MS = 4500;
