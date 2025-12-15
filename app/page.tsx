// app/page.tsx
"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

// -------------------------------------------------------------------------
// 1. DATA STRUCTURE (โครงสร้างข้อมูลเนื้อหา 7 บท - ปรับสีให้เข้ากับธีมม่วง)
// -------------------------------------------------------------------------

interface Lesson {
  id: string;
  title: string;
  icon: string;
  color: string;
  content: string[];
}

const lessonData: Lesson[] = [
  {
    id: "1",
    title: "บทที่ 1: การติดตั้งและการกำหนดค่าพื้นฐานเครือข่าย",
    icon: "💻",
    color:
      "bg-purple-100/60 dark:bg-purple-900/35 hover:bg-purple-200/70 dark:hover:bg-purple-800/55",
    content: [
      "ภาพรวมของการบริหารเครือข่ายและความสำคัญ",
      "การติดตั้งและตั้งค่าอุปกรณ์หลัก เช่น Switch, Router",
      "การบริหารจัดการอุปกรณ์ผ่าน Console, Telnet, SSH",
    ],
  },
  {
    id: "2",
    title: "บทที่ 2: การจัดสรรและการจัดการหมายเลข IP",
    icon: "🔢",
    color:
      "bg-indigo-100/60 dark:bg-indigo-900/35 hover:bg-indigo-200/70 dark:hover:bg-indigo-800/55",
    content: [
      "การกำหนด Static IP และการประยุกต์ใช้",
      "หลักการทำงานและการตั้งค่า DHCP Server/Client",
      "การออกแบบ Subnetting และ Supernetting",
    ],
  },
  {
    id: "3",
    title: "บทที่ 3: การค้นหาเส้นทางและการเราต์",
    icon: "🗺️",
    color:
      "bg-fuchsia-100/60 dark:bg-fuchsia-900/35 hover:bg-fuchsia-200/70 dark:hover:bg-fuchsia-800/55",
    content: [
      "แนวคิด Routing และ Routing Table",
      "การกำหนด Static Routing",
      "การใช้งาน Dynamic Routing Protocols (RIP, OSPF, EIGRP)",
    ],
  },
  {
    id: "4",
    title: "บทที่ 4: ระบบเครือข่ายไร้สาย",
    icon: "📡",
    color:
      "bg-violet-100/60 dark:bg-violet-900/35 hover:bg-violet-200/70 dark:hover:bg-violet-800/55",
    content: [
      "มาตรฐาน 802.11 และอุปกรณ์ Access Point",
      "การตั้งค่า SSID และการจัดการช่องสัญญาณ",
      "มาตรฐานความปลอดภัยไร้สาย (WPA2/WPA3)",
    ],
  },
  {
    id: "5",
    title: "บทที่ 5: ระบบความปลอดภัยเครือข่าย",
    icon: "🛡️",
    color:
      "bg-pink-100/60 dark:bg-pink-900/35 hover:bg-pink-200/70 dark:hover:bg-pink-800/55",
    content: [
      "ภัยคุกคามในระดับเครือข่ายและการป้องกัน",
      "หลักการทำงานและประเภทของ Firewall",
      "การกำหนดค่า Access Control List (ACL)",
    ],
  },
  {
    id: "6",
    title: "บทที่ 6: การออกแบบ VPN",
    icon: "🔑",
    color:
      "bg-rose-100/60 dark:bg-rose-900/35 hover:bg-rose-200/70 dark:hover:bg-rose-800/55",
    content: [
      "ประเภท VPN (Site-to-Site, Remote Access)",
      "การทำความเข้าใจโปรโตคอล (IPsec, SSL/TLS)",
      "การติดตั้งและตั้งค่า VPN เพื่อการเข้าถึงที่ปลอดภัย",
    ],
  },
  {
    id: "7",
    title: "บทที่ 7: การประยุกต์ใช้เครือข่ายในองค์กร",
    icon: "🏢",
    color:
      "bg-sky-100/60 dark:bg-sky-900/35 hover:bg-sky-200/70 dark:hover:bg-sky-800/55",
    content: [
      "การออกแบบโครงสร้างเครือข่ายสำหรับองค์กร",
      "การประยุกต์ใช้ระบบเซิร์ฟเวอร์และ Cloud Networking",
      "เครื่องมือสำหรับการ Monitoring และ Troubleshooting",
    ],
  },
];

// -------------------------------------------------------------------------
// 0) Helper: class join
// -------------------------------------------------------------------------
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// -------------------------------------------------------------------------
// A) Dark/Light Toggle (แปะในหน้าเดียว + localStorage)
// -------------------------------------------------------------------------
type ThemeMode = "light" | "dark";

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  if (mode === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}
function getInitialTheme(): ThemeMode {
  const saved = (typeof window !== "undefined"
    ? (localStorage.getItem("theme") as ThemeMode | null)
    : null) as ThemeMode | null;
  if (saved === "light" || saved === "dark") return saved;

  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches;

  return prefersDark ? "dark" : "light";
}

function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = getInitialTheme();
    setMode(initial);
    applyTheme(initial);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: ThemeMode = mode === "dark" ? "light" : "dark";
    setMode(next);
    applyTheme(next);
    localStorage.setItem("theme", next);
  };

  if (!mounted) {
    return (
      <button className="px-4 py-2 rounded-full bg-white/70 dark:bg-zinc-900/60 border border-purple-200/70 dark:border-purple-800/70 text-sm font-semibold">
        …
      </button>
    );
  }

  const isDark = mode === "dark";

  return (
    <button
      onClick={toggle}
      className={cn(
        "group inline-flex items-center gap-2 px-4 py-2 rounded-full",
        "bg-white/75 dark:bg-zinc-900/60 backdrop-blur",
        "border border-purple-200/70 dark:border-purple-800/70",
        "shadow-[0_12px_30px_-18px_rgba(124,58,237,0.55)]",
        "hover:-translate-y-0.5 hover:shadow-[0_18px_45px_-22px_rgba(124,58,237,0.75)]",
        "transition-all duration-300",
        "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-70"
      )}
      title="สลับ Dark/Light"
      aria-label="Toggle theme"
    >
      <span className="text-lg">{isDark ? "🌙" : "☀️"}</span>
      <span className="text-sm font-extrabold text-zinc-800 dark:text-zinc-100">
        {isDark ? "Dark" : "Light"}
      </span>
      <span className="ml-1 text-xs text-purple-600/80 dark:text-purple-300/80 opacity-0 group-hover:opacity-100 transition">
        toggle
      </span>
    </button>
  );
}

// -------------------------------------------------------------------------
// B) Background FX (มินิมอลแต่มีสี + เงา + grid soft)
// -------------------------------------------------------------------------
function BackgroundFX() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* glow blobs */}
      <div className="absolute -top-44 -left-44 h-[520px] w-[520px] rounded-full bg-purple-500/20 blur-3xl animate-[pulse_7s_ease-in-out_infinite]" />
      <div className="absolute -top-40 right-[-160px] h-[560px] w-[560px] rounded-full bg-indigo-500/18 blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-220px] left-[18%] h-[620px] w-[620px] rounded-full bg-fuchsia-500/14 blur-3xl animate-[pulse_9s_ease-in-out_infinite]" />

      {/* soft grid */}
      <div
        className="absolute inset-0 opacity-[0.25] dark:opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(124,58,237,0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(124,58,237,0.16) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(circle at 50% 25%, black 35%, transparent 72%)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 25%, black 35%, transparent 72%)",
        }}
      />
    </div>
  );
}

// -------------------------------------------------------------------------
// 2. CHILD COMPONENT: LessonCard (Hover spotlight ตามเมาส์ + เงาเท่ ๆ)
// -------------------------------------------------------------------------

interface LessonCardProps {
  lesson: Lesson;
  onLessonClick: (lessonId: string) => void;
}

const LessonCard = ({ lesson, onLessonClick }: LessonCardProps) => {
  const [pos, setPos] = useState({ x: 50, y: 40 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x, y });
  };

  return (
    <div
      onMouseMove={handleMove}
      onClick={() => onLessonClick(lesson.id)}
      className={cn(
        "group relative cursor-pointer p-6 rounded-2xl border",
        "border-purple-200/70 dark:border-purple-800/60",
        "transition-all duration-300 transform",
        "hover:scale-[1.03] active:scale-[1.01] active:shadow-none active:translate-y-0.5",
        "shadow-[0_18px_55px_-30px_rgba(124,58,237,0.55)]",
        "hover:shadow-[0_28px_85px_-40px_rgba(124,58,237,0.85)]",
        "overflow-hidden",
        lesson.color,
        "dark:bg-zinc-800/80"
      )}
    >
      {/* Spotlight overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(260px circle at ${pos.x}% ${pos.y}%, rgba(255,255,255,0.38), transparent 60%)`,
        }}
      />
      {/* Color glow overlay (เพิ่มสีแบบเท่ ๆ) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(320px circle at ${pos.x}% ${pos.y}%, rgba(124,58,237,0.28), transparent 62%)`,
        }}
      />

      {/* Top shimmer line */}
      <div className="pointer-events-none absolute -top-10 left-0 right-0 h-10 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-y-10 transition-all duration-500" />

      {/* content */}
      <div className="relative">
        <div className="text-3xl mb-3 drop-shadow">{lesson.icon}</div>

        <h3 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-50">
          {lesson.title}
        </h3>

        <ul className="mt-3 ml-4 list-disc text-zinc-700 dark:text-zinc-300 text-sm leading-6 space-y-1">
          {lesson.content.slice(0, 3).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <p className="text-sm font-extrabold text-purple-700 dark:text-purple-300 mt-4 flex items-center gap-2">
          คลิกเพื่อดูรายละเอียด{" "}
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </p>
      </div>

      {/* Border glow */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-purple-500/0 group-hover:ring-purple-500/25 dark:group-hover:ring-purple-300/15 transition" />
    </div>
  );
};

// -------------------------------------------------------------------------
// 3. CHILD COMPONENT: LessonDetail (เพิ่มสี/เงาแบบมินิมอล)
// -------------------------------------------------------------------------

interface LessonDetailProps {
  lesson: Lesson;
  onBack: () => void;
}

const LessonDetail = ({ lesson, onBack }: LessonDetailProps) => (
  <div className="animate-fade-in">
    <button
      onClick={onBack}
      className={cn(
        "flex items-center mb-8 px-6 py-3 rounded-full text-white",
        "bg-gradient-to-r from-purple-600 to-indigo-600",
        "shadow-[0_18px_55px_-25px_rgba(124,58,237,0.85)]",
        "hover:shadow-[0_26px_80px_-30px_rgba(124,58,237,1)]",
        "transition-all duration-300 transform hover:-translate-y-1",
        "active:shadow-none active:translate-y-0.5",
        "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75"
      )}
    >
      <span className="mr-2 text-xl">←</span>
      <span className="text-lg font-semibold">กลับสู่หน้าหลัก</span>
    </button>

    <div className="relative overflow-hidden rounded-3xl border border-purple-200/70 dark:border-purple-800/60 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl shadow-[0_24px_90px_-45px_rgba(124,58,237,0.55)]">
      {/* header glow */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-purple-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -top-24 right-[-90px] h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative p-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 flex items-center mb-2 border-b pb-4 border-purple-200/80 dark:border-purple-800/60">
          <span className="mr-3 text-5xl">{lesson.icon}</span> {lesson.title}
        </h1>
        <p className="text-lg md:text-xl font-semibold text-purple-700 dark:text-purple-300 mb-6">
          {lesson.title.substring(lesson.title.indexOf(":") + 2)}
        </p>

        <div className="space-y-6 text-zinc-700 dark:text-zinc-300 text-base md:text-lg">
          {lesson.content.map((item, index) => (
            <div
              key={index}
              className={cn(
                "p-5 rounded-2xl border",
                "bg-white/60 dark:bg-zinc-800/70 backdrop-blur",
                "border-purple-200/70 dark:border-purple-800/60",
                "shadow-[0_14px_50px_-35px_rgba(0,0,0,0.35)]",
                "hover:shadow-[0_22px_75px_-45px_rgba(124,58,237,0.55)]",
                "transition"
              )}
            >
              <p className="font-extrabold text-purple-800 dark:text-purple-200 mb-2 text-lg">
                <span className="mr-2 text-purple-600 dark:text-purple-400">
                  ❖
                </span>{" "}
                หัวข้อหลักที่ {index + 1}
              </p>
              <p>{item}</p>
            </div>
          ))}

          <div className="p-6 rounded-2xl border border-purple-300/70 dark:border-purple-700/60 bg-gradient-to-br from-purple-100/70 to-indigo-100/60 dark:from-purple-900/45 dark:to-indigo-900/25 shadow-[0_18px_65px_-40px_rgba(124,58,237,0.55)]">
            <h3 className="font-extrabold text-purple-800 dark:text-purple-200 text-xl flex items-center mb-2">
              <span className="mr-3 text-2xl">💡</span> สิ่งที่ต้องฝึกปฏิบัติ
            </h3>
            <p className="mt-2 text-purple-800 dark:text-purple-200 text-base leading-relaxed">
              เน้นการปฏิบัติจริง เช่น การกำหนดค่า IP บน CLI, การตั้งค่า Firewall
              rules, หรือการจำลองการทำงานของ Routing Protocol เพื่อเสริมสร้างความเข้าใจและทักษะ.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// -------------------------------------------------------------------------
// 4. CHILD COMPONENT: GradeCalculator (คง logic เดิม เพิ่มเงา/สี/มินิมอล)
// -------------------------------------------------------------------------

function GradeCalculator() {
  const [score, setScore] = useState<string>("");
  const [maxScore, setMaxScore] = useState<string>("100");
  const [grade, setGrade] = useState<string | null>(null);
  const [percent, setPercent] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("");

  const handleCalculate = () => {
    const s = parseFloat(score);
    const m = parseFloat(maxScore);

    if (isNaN(s) || isNaN(m) || m <= 0) {
      setGrade(null);
      setPercent(null);
      setMessage("กรุณากรอกคะแนนและคะแนนเต็มให้ถูกต้อง");
      return;
    }

    const p = (s / m) * 100;
    let g = "F";

    if (p >= 80) g = "A";
    else if (p >= 75) g = "B+";
    else if (p >= 70) g = "B";
    else if (p >= 65) g = "C+";
    else if (p >= 60) g = "C";
    else if (p >= 55) g = "D+";
    else if (p >= 50) g = "D";
    else g = "F";

    setPercent(parseFloat(p.toFixed(2)));
    setGrade(g);
    setMessage("");
  };

  return (
    <div className="relative p-6 rounded-2xl bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-purple-200/70 dark:border-purple-800/60 shadow-[0_22px_80px_-45px_rgba(124,58,237,0.55)] overflow-hidden">
      <div className="pointer-events-none absolute -top-28 -left-28 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />

      <h3 className="text-xl font-extrabold text-purple-900 dark:text-purple-100 flex items-center mb-4">
        <span className="mr-2 text-2xl">📊</span> เครื่องมือตัดเกรด (Grade
        Calculator)
      </h3>

      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            คะแนนที่ได้ (Score)
          </label>
          <input
            type="number"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="rounded-xl px-4 py-2 bg-white/90 dark:bg-zinc-800/80 border border-purple-200/70 dark:border-purple-700/70 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="เช่น 78"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            คะแนนเต็ม (Max Score)
          </label>
          <input
            type="number"
            value={maxScore}
            onChange={(e) => setMaxScore(e.target.value)}
            className="rounded-xl px-4 py-2 bg-white/90 dark:bg-zinc-800/80 border border-purple-200/70 dark:border-purple-700/70 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="เช่น 100"
          />
        </div>

        <button
          onClick={handleCalculate}
          className="w-full mt-2 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold shadow-[0_18px_55px_-25px_rgba(124,58,237,0.85)] hover:shadow-[0_26px_80px_-30px_rgba(124,58,237,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all duration-200"
        >
          คำนวณเกรด
        </button>

        {message && (
          <p className="mt-2 text-sm text-red-500 dark:text-red-400">
            {message}
          </p>
        )}

        {grade && percent !== null && (
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-purple-100/80 to-indigo-100/60 dark:from-purple-900/45 dark:to-indigo-900/25 border border-purple-300/70 dark:border-purple-700/60 shadow-[0_16px_55px_-38px_rgba(124,58,237,0.6)]">
            <p className="text-sm text-zinc-700 dark:text-zinc-200">
              เปอร์เซ็นต์: <span className="font-extrabold">{percent}%</span>
            </p>
            <p className="mt-1 text-lg font-extrabold text-purple-800 dark:text-purple-200">
              เกรดที่ได้: <span className="text-2xl">{grade}</span>
            </p>
            <p className="mt-1 text-xs text-purple-700/80 dark:text-purple-300/80">
              เกณฑ์ตัวอย่าง: A ≥ 80, B+ ≥ 75, B ≥ 70, C+ ≥ 65, C ≥ 60, D+ ≥ 55,
              D ≥ 50, F &lt; 50
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------------------
// 5. CHILD COMPONENT: BasicMathTool (คง logic เดิม เพิ่มเงา/สี)
// -------------------------------------------------------------------------

function BasicMathTool() {
  const [a, setA] = useState<string>("");
  const [b, setB] = useState<string>("");
  const [result, setResult] = useState<string>("");

  const parseInputs = (): { x: number; y: number; valid: boolean } => {
    const x = parseFloat(a);
    const y = parseFloat(b);
    if (isNaN(x) || isNaN(y)) {
      setResult("กรุณากรอกตัวเลขให้ถูกต้องทั้งสองช่อง");
      return { x: 0, y: 0, valid: false };
    }
    return { x, y, valid: true };
  };

  const handleAdd = () => {
    const { x, y, valid } = parseInputs();
    if (!valid) return;
    setResult(`${x} + ${y} = ${x + y}`);
  };

  const handleSub = () => {
    const { x, y, valid } = parseInputs();
    if (!valid) return;
    setResult(`${x} - ${y} = ${x - y}`);
  };

  const handleMul = () => {
    const { x, y, valid } = parseInputs();
    if (!valid) return;
    setResult(`${x} × ${y} = ${x * y}`);
  };

  const handleDiv = () => {
    const { x, y, valid } = parseInputs();
    if (!valid) return;
    if (y === 0) {
      setResult("หารด้วย 0 ไม่ได้");
      return;
    }
    const value = x / y;
    setResult(`${x} ÷ ${y} = ${parseFloat(value.toFixed(4))}`);
  };

  const handleSquare = () => {
    const x = parseFloat(a);
    if (isNaN(x)) {
      setResult("กรุณากรอกตัวเลขในช่องแรกเพื่อยกกำลัง 2");
      return;
    }
    setResult(`${x}² = ${x * x}`);
  };

  return (
    <div className="relative p-6 rounded-2xl bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-fuchsia-200/70 dark:border-fuchsia-800/60 shadow-[0_22px_80px_-45px_rgba(192,38,211,0.35)] overflow-hidden">
      <div className="pointer-events-none absolute -top-28 -right-28 h-72 w-72 rounded-full bg-fuchsia-500/18 blur-3xl" />

      <h3 className="text-xl font-extrabold text-fuchsia-900 dark:text-fuchsia-100 flex items-center mb-4">
        <span className="mr-2 text-2xl">🧮</span> ฝึกคิดเลขพื้นฐาน
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
              ตัวเลขที่ 1 (A)
            </label>
            <input
              type="number"
              value={a}
              onChange={(e) => setA(e.target.value)}
              className="rounded-xl px-4 py-2 bg-white/90 dark:bg-zinc-800/80 border border-fuchsia-200/70 dark:border-fuchsia-700/70 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              placeholder="เช่น 5"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
              ตัวเลขที่ 2 (B)
            </label>
            <input
              type="number"
              value={b}
              onChange={(e) => setB(e.target.value)}
              className="rounded-xl px-4 py-2 bg-white/90 dark:bg-zinc-800/80 border border-fuchsia-200/70 dark:border-fuchsia-700/70 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              placeholder="เช่น 3"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
          <button
            onClick={handleAdd}
            className="py-2 rounded-full bg-fuchsia-600/90 hover:bg-fuchsia-500 text-white text-sm font-extrabold shadow-md hover:shadow-lg active:shadow-none active:translate-y-0.5 transition-all"
          >
            A + B
          </button>
          <button
            onClick={handleSub}
            className="py-2 rounded-full bg-purple-600/90 hover:bg-purple-500 text-white text-sm font-extrabold shadow-md hover:shadow-lg active:shadow-none active:translate-y-0.5 transition-all"
          >
            A - B
          </button>
          <button
            onClick={handleMul}
            className="py-2 rounded-full bg-indigo-600/90 hover:bg-indigo-500 text-white text-sm font-extrabold shadow-md hover:shadow-lg active:shadow-none active:translate-y-0.5 transition-all"
          >
            A × B
          </button>
          <button
            onClick={handleDiv}
            className="py-2 rounded-full bg-sky-600/90 hover:bg-sky-500 text-white text-sm font-extrabold shadow-md hover:shadow-lg active:shadow-none active:translate-y-0.5 transition-all"
          >
            A ÷ B
          </button>
        </div>

        <button
          onClick={handleSquare}
          className="w-full mt-3 py-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-extrabold shadow-[0_16px_55px_-28px_rgba(192,38,211,0.75)] hover:shadow-[0_22px_75px_-32px_rgba(192,38,211,0.95)] active:shadow-none active:translate-y-0.5 transition-all"
        >
          ยกกำลัง 2 ของ A (A²)
        </button>

        {result && (
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-fuchsia-100/80 to-purple-100/70 dark:from-fuchsia-900/40 dark:to-purple-900/30 border border-fuchsia-300/70 dark:border-fuchsia-700/60 shadow-[0_16px_55px_-38px_rgba(192,38,211,0.55)]">
            <p className="text-sm font-extrabold text-zinc-700 dark:text-zinc-100">
              ผลลัพธ์:
            </p>
            <p className="mt-1 text-lg font-extrabold text-fuchsia-900 dark:text-fuchsia-100">
              {result}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------------------
// 6) CHILD COMPONENT: PDFCard (เพิ่มเงา + glow + มินิมอล)
// -------------------------------------------------------------------------

function PDFCard({
  title,
  desc,
  href,
  accent = "from-purple-600 to-indigo-600",
}: {
  title: string;
  desc: string;
  href: string;
  accent?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative p-5 rounded-2xl border border-purple-200/70 dark:border-purple-800/60 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-xl shadow-[0_18px_70px_-45px_rgba(124,58,237,0.55)] overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-purple-500/18 blur-3xl" />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-extrabold text-zinc-900 dark:text-zinc-50">
            {title}
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">
            {desc}
          </p>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="shrink-0 px-4 py-2 rounded-full bg-white/85 dark:bg-zinc-900/60 border border-purple-200/70 dark:border-purple-700/60 text-purple-800 dark:text-purple-200 font-extrabold hover:shadow transition"
        >
          {open ? "ซ่อน Preview" : "Preview"}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "px-4 py-2 rounded-full text-white font-extrabold transition",
            "bg-gradient-to-r",
            accent,
            "shadow-[0_16px_55px_-28px_rgba(124,58,237,0.75)] hover:shadow-[0_22px_75px_-32px_rgba(124,58,237,0.95)] hover:-translate-y-0.5"
          )}
        >
          Fullscreen
        </a>

        <a
          href={href}
          download
          className="px-4 py-2 rounded-full bg-purple-100/80 dark:bg-purple-900/35 text-purple-800 dark:text-purple-200 font-extrabold border border-purple-200/70 dark:border-purple-700/60 hover:shadow hover:-translate-y-0.5 transition"
        >
          Download
        </a>
      </div>

      {open && (
        <div className="mt-5 overflow-hidden rounded-2xl border border-purple-200/70 dark:border-purple-800/60 bg-white dark:bg-zinc-900">
          <div className="px-4 py-3 border-b border-purple-200/70 dark:border-purple-800/60 flex items-center justify-between">
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
              ตัวอย่างเอกสาร (PDF Preview)
            </p>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-extrabold text-purple-700 dark:text-purple-300 hover:underline"
            >
              เปิดเต็มจอ →
            </a>
          </div>

          <iframe
            src={`${href}#view=FitH`}
            className="w-full h-[520px] md:h-[600px]"
            title={title}
          />
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------------------
// 7. MAIN COMPONENT (หน้าหลักที่จัดการ State)
// -------------------------------------------------------------------------

export default function Home() {
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const selectedLesson = useMemo(
    () => lessonData.find((l) => l.id === selectedLessonId),
    [selectedLessonId]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-100 dark:from-black dark:via-zinc-950 dark:to-zinc-950 flex justify-center py-16 px-6">
      <BackgroundFX />

      <main
        className={cn(
          "w-full max-w-5xl rounded-3xl p-10",
          "bg-white/75 dark:bg-zinc-900/60 backdrop-blur-xl",
          "shadow-[0_30px_120px_-65px_rgba(124,58,237,0.65)]",
          "border border-purple-200/70 dark:border-purple-900/50",
          "relative overflow-hidden"
        )}
      >
        {/* header glow */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-purple-500/18 blur-3xl" />
        <div className="pointer-events-none absolute -top-24 right-[-120px] h-72 w-72 rounded-full bg-indigo-500/14 blur-3xl" />

        {/* Header (แสดงเฉพาะหน้าหลัก) */}
        {!selectedLessonId && (
          <div className="relative flex flex-col items-center text-center pb-8 border-b border-purple-200/70 dark:border-purple-800/60 mb-8">
            {/* top right theme toggle */}
            <div className="absolute right-0 top-0">
              <ThemeToggle />
            </div>

            <Image
              src="/next.svg"
              alt="Next.js"
              width={120}
              height={50}
              className="dark:invert mb-4"
            />
            <h1 className="text-4xl font-extrabold mt-6 text-purple-900 dark:text-purple-100 drop-shadow">
              BSCCT604 – การบริหารเครือข่ายคอมพิวเตอร์
            </h1>
            <p className="text-purple-700 dark:text-purple-300 mt-2 text-xl font-semibold">
              Computer Network Administration
            </p>

           
            
          </div>
        )}

        {/* ถ้าเลือกบทแล้ว แสดงรายละเอียด */}
        {selectedLesson ? (
          <LessonDetail
            lesson={selectedLesson}
            onBack={() => setSelectedLessonId(null)}
          />
        ) : (
          <>
            {/* ข้อมูลรายวิชา */}
            <section className="mt-2 p-6 rounded-2xl border border-purple-200/70 dark:border-purple-800/60 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-xl shadow-[0_18px_70px_-45px_rgba(124,58,237,0.55)]">
              <h2 className="text-2xl font-extrabold text-purple-900 dark:text-purple-100 flex items-center">
                <span className="mr-3 text-3xl">📘</span> ข้อมูลรายวิชา
              </h2>
              <div className="mt-4 text-zinc-700 dark:text-zinc-300 leading-7 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-lg">
                  <p>
                    <strong>หน่วยกิต:</strong> 3(2-2-5)
                  </p>
                  <p>
                    <strong>รหัสรายวิชาเดิม:</strong> ไม่มี
                  </p>
                </div>
                <div className="text-lg">
                  <p>
                    <strong>วิชาบังคับก่อน:</strong> BSCCT603
                    การสื่อสารข้อมูลและระบบเครือข่ายคอมพิวเตอร์
                  </p>
                </div>

                <p className="mt-4 col-span-full text-base italic text-purple-700 dark:text-purple-300 leading-relaxed">
                  ศึกษาและฝึกปฏิบัติเกี่ยวกับการติดตั้งและกำหนดค่าทางเครือข่ายคอมพิวเตอร์ในรูปแบบต่าง ๆ
                  การค้นหาเส้นทาง การจัดสรรหมายเลขไอพีแบบคงที่และแบบพลวัต ระบบเครือข่ายคอมพิวเตอร์ไร้สาย
                  ระบบความปลอดภัยในเครือข่ายคอมพิวเตอร์ การออกแบบช่องทางการสื่อสารชนิดส่วนบุคคล (VPN)
                  และการประยุกต์ใช้ระบบเครือข่ายคอมพิวเตอร์กับองค์กรแบบต่าง ๆ
                </p>

                <p className="mt-2 col-span-full text-sm text-purple-400 dark:text-purple-500 leading-relaxed">
                  *Study and practice in installation and setup of computer network with various applications, routing,
                  assignment of static and dynamic IP addresses, wireless network system, computer network security,
                  virtual private network design, and application of computer network in various types of organization.
                </p>
              </div>
            </section>

            {/* Documents Section: PDF Preview */}
            <section className="mt-10 p-6 rounded-2xl border border-purple-200/70 dark:border-purple-800/60 bg-white/60 dark:bg-zinc-900/45 backdrop-blur-xl shadow-[0_18px_70px_-45px_rgba(124,58,237,0.55)]">
              <h2 className="text-2xl font-extrabold text-purple-900 dark:text-purple-100 mb-4 flex items-center">
                <span className="mr-3 text-3xl">📄</span> เอกสารประกอบ (PDF)
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <PDFCard
                  title="แบบฝึกหัด IP Address"
                  desc="เปิดอ่าน/พรีวิวในหน้า หรือเปิดเต็มจอได้ทันที"
                  href="/pdf/แบบฝึกหัด%20IP%20Address.pdf"
                  accent="from-purple-600 to-indigo-600"
                />

                <PDFCard
                  title="ใบประกาศ"
                  desc="พรีวิวในหน้า + ดาวน์โหลดไฟล์ PDF"
                  href="/pdf/ใบประกาศ.pdf"
                  accent="from-fuchsia-600 to-purple-600"
                />
              </div>
            </section>

            {/* Lessons Grid */}
            <section className="mt-12">
              <h2 className="text-2xl font-extrabold text-purple-900 dark:text-purple-100 mb-6 flex items-center">
                <span className="mr-3 text-3xl">🚀</span> หน่วยการเรียนรู้ทั้งหมด 7 บท
              </h2>

              <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
                {lessonData.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    onLessonClick={setSelectedLessonId}
                  />
                ))}
              </div>
            </section>

            {/* Tools Section */}
            <section className="mt-16">
              <h2 className="text-2xl font-extrabold text-purple-900 dark:text-purple-100 mb-6 flex items-center">
                <span className="mr-3 text-3xl">🧰</span> เครื่องมือช่วยเรียน (Tools)
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <GradeCalculator />
                <BasicMathTool />
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
