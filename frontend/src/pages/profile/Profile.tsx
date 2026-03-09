import Header from "../../components/header/Header";
import { useAuthStore } from "../../stores/useAuthStore";
import {
  MapPin,
  Calendar,
  Link as LinkIcon,
  Trophy,
  Eye,
  Medal,
} from "lucide-react";
import { Link } from "react-router";

const Profile = () => {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      {/* Main Layout Container */}
      <div className="flex flex-1 max-w-[1240px] w-full mx-auto px-4 md:px-8 py-8 md:py-10">
        <main className="w-full">
          {/* Header Profile Section */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm mb-8">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full p-1 bg-white border-4 border-slate-100 shadow-sm">
                  <div className="w-full h-full rounded-full overflow-hidden bg-slate-200">
                    {user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={`https://ui-avatars.com/api/?name=${
                          user?.displayName || user?.userName || "U"
                        }&background=random&size=150`}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>
                {/* Online Indicator */}
                <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
              </div>

              {/* User Info */}
              <div className="flex-1 flex flex-col">
                <h1 className="text-2xl md:text-[32px] font-extrabold text-slate-800 mb-1">
                  {user?.displayName || "Nguyen Van A"}
                </h1>
                <p className="text-[17px] font-semibold text-slate-500 mb-4">
                  Full Stack Developer | Python Enthusiast
                </p>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-5 text-[14px] font-medium text-slate-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-[18px] h-[18px]" strokeWidth={2} />
                    Hanoi, Vietnam
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-[18px] h-[18px]" strokeWidth={2} />
                    Joined March 2019
                  </div>
                  <div className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors">
                    <LinkIcon className="w-[18px] h-[18px]" strokeWidth={2} />
                    nguyenvana.dev
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[13px] rounded-full">
                    Python
                  </span>
                  <span className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[13px] rounded-full">
                    Django
                  </span>
                  <span className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[13px] rounded-full">
                    React
                  </span>
                  <span className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[13px] rounded-full">
                    Docker
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column (Stats & Badges) - 4 cols */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              {/* Community Stats */}
              <div>
                <h2 className="text-[20px] font-black text-slate-800 mb-4">
                  Community Stats
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-extrabold text-[24px] text-slate-800 leading-none">
                        15,420
                      </span>
                      <Trophy className="w-[20px] h-[20px] text-yellow-500" strokeWidth={2.5} />
                    </div>
                    <span className="text-[14px] font-semibold text-slate-500">
                      Reputation
                    </span>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-extrabold text-[24px] text-slate-800 leading-none">
                        5.2m
                      </span>
                      <Eye className="w-[20px] h-[20px] text-blue-500" strokeWidth={2.5} />
                    </div>
                    <span className="text-[14px] font-semibold text-slate-500">
                      Profile Views
                    </span>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[20px] font-black text-slate-800">
                    Badges
                  </h2>
                  <Link
                    to="#"
                    className="text-blue-600 font-bold text-[14px] hover:underline"
                  >
                    View all
                  </Link>
                </div>
                <div className="flex flex-col gap-4">
                  {/* Gold */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
                    <div className="w-[42px] h-[42px] bg-yellow-50 rounded-full flex items-center justify-center border border-yellow-100 shrink-0">
                      <Medal className="w-[22px] h-[22px] text-yellow-500" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-[16px] text-slate-800 flex items-center gap-2">
                        12 Gold Badges
                      </h3>
                      <p className="text-[13px] font-medium text-slate-500 mt-1">
                        Famous Question, Great Answer...
                      </p>
                    </div>
                  </div>
                  {/* Silver */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
                    <div className="w-[42px] h-[42px] bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 shrink-0">
                      <Medal className="w-[22px] h-[22px] text-slate-500" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-[16px] text-slate-800 flex items-center gap-2">
                        45 Silver Badges
                      </h3>
                      <p className="text-[13px] font-medium text-slate-500 mt-1">
                        Necromancer, Good Question...
                      </p>
                    </div>
                  </div>
                  {/* Bronze */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
                    <div className="w-[42px] h-[42px] bg-orange-50 rounded-full flex items-center justify-center border border-orange-100 shrink-0">
                      <Medal className="w-[22px] h-[22px] text-orange-500" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-[16px] text-slate-800 flex items-center gap-2">
                        128 Bronze Badges
                      </h3>
                      <p className="text-[13px] font-medium text-slate-500 mt-1">
                        Scholar, Student, Editor...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (Tags & Activity) - 8 cols */}
            <div className="lg:col-span-8 flex flex-col gap-10">
              {/* Top Tags */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[20px] font-black text-slate-800">
                    Top Tags
                  </h2>
                  <Link
                    to="#"
                    className="text-blue-600 font-bold text-[14px] hover:underline"
                  >
                    View all tags
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: "python", score: "4,820", answers: "156" },
                    { name: "javascript", score: "3,540", answers: "98" },
                    { name: "react", score: "2,115", answers: "72" },
                    { name: "django", score: "1,890", answers: "45" },
                  ].map((tag) => (
                    <div
                      key={tag.name}
                      className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between"
                    >
                      <span className="px-3.5 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[14px] rounded-lg">
                        {tag.name}
                      </span>
                      <div className="flex gap-6 text-right">
                        <div>
                          <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-0.5">
                            SCORE
                          </div>
                          <div className="font-extrabold text-[16px] text-slate-800">
                            {tag.score}
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-0.5">
                            ANSWERS
                          </div>
                          <div className="font-extrabold text-[16px] text-slate-800">
                            {tag.answers}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Answers */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[20px] font-black text-slate-800">
                    Top Answers
                  </h2>
                  <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button className="px-4 py-1.5 bg-blue-500 text-white text-[13px] font-bold rounded-md shadow-sm">
                      Votes
                    </button>
                    <button className="px-4 py-1.5 text-slate-600 text-[13px] font-bold rounded-md hover:text-slate-900">
                      Newest
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Answer item 1 */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row gap-5">
                    <div className="shrink-0 flex flex-col items-center">
                      <div className="px-4 py-2 bg-green-50 text-green-600 font-extrabold text-[17px] rounded-xl mb-1 border border-green-100">
                        +1,204
                      </div>
                      <span className="text-[13px] font-semibold text-slate-400">
                        votes
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-extrabold text-[18px] text-slate-800 leading-snug mb-2 hover:text-blue-600 cursor-pointer">
                        How to properly use useEffect dependency array in React 18?
                      </h3>
                      <p className="text-[14px] font-medium text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                        The key change in React 18 concerning useEffect is how strict mode behaves in development. However, the dependency array logic remains...
                      </p>
                      <div className="flex flex-wrap items-center justify-between gap-y-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[12px] font-bold rounded-md border border-slate-200">
                            react
                          </span>
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[12px] font-bold rounded-md border border-slate-200">
                            javascript
                          </span>
                        </div>
                        <span className="text-[13px] font-semibold text-slate-400">
                          Answered Mar 12
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Answer item 2 */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row gap-5">
                    <div className="shrink-0 flex flex-col items-center">
                      <div className="px-4 py-2 bg-slate-100 text-slate-700 font-extrabold text-[17px] rounded-xl mb-1 border border-slate-200">
                        +856
                      </div>
                      <span className="text-[13px] font-semibold text-slate-400">
                        votes
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-extrabold text-[18px] text-slate-800 leading-snug mb-2 hover:text-blue-600 cursor-pointer">
                        Understanding Python's GIL and Multithreading
                      </h3>
                      <p className="text-[14px] font-medium text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                        The Global Interpreter Lock (GIL) is a mutex that protects access to Python objects, preventing multiple threads from executing Python...
                      </p>
                      <div className="flex flex-wrap items-center justify-between gap-y-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[12px] font-bold rounded-md border border-slate-200">
                            python
                          </span>
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[12px] font-bold rounded-md border border-slate-200">
                            multithreading
                          </span>
                        </div>
                        <span className="text-[13px] font-semibold text-slate-400">
                          Answered Feb 28
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* View all answers btn */}
                  <button className="w-full py-3.5 bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 font-bold text-[14px] rounded-xl transition-colors mt-2">
                    View all 842 answers
                  </button>
                </div>
              </div>

              {/* Top Questions */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[20px] font-black text-slate-800">
                    Top Questions
                  </h2>
                  <Link
                    to="#"
                    className="text-blue-600 font-bold text-[14px] hover:underline"
                  >
                    View all
                  </Link>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between gap-5">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-[42px] h-[42px] bg-blue-50 text-blue-600 rounded-xl font-black text-[18px] flex items-center justify-center border border-blue-100 shrink-0">
                      Q
                    </div>
                    <h3 className="font-extrabold text-[16px] text-slate-800 flex-1 leading-snug hover:text-blue-600 cursor-pointer truncate">
                      Best practices for REST API error handling?
                    </h3>
                  </div>
                  <div className="flex items-center gap-8 shrink-0 hidden sm:flex">
                    <div className="flex flex-col text-center">
                      <span className="text-[13px] font-semibold text-slate-500">24</span>
                      <span className="text-[12px] font-medium text-slate-400">answers</span>
                    </div>
                    <div className="flex flex-col text-center">
                      <span className="text-[13px] font-semibold text-slate-500">15k</span>
                      <span className="text-[12px] font-medium text-slate-400">views</span>
                    </div>
                    <div className="font-extrabold text-[15px] text-green-600 w-[60px] text-right">
                      +210
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
