import Header from "../../components/header/Header";
import { useAuthStore } from "../../stores/useAuthStore";
import {
  Trophy,
  Eye,
} from "lucide-react";
import { Link, useParams } from "react-router";
import { useEffect, useState } from "react";
import { useProfileStore } from "../../stores/useProfileStore";
import Loading from "../../components/ui/Loading";
import ProfileHeader from "../../components/profile/ProfileHeader";
import { useSocketStore } from "../../stores/useSocketStore";

const Profile = () => {
  const currentUser = useAuthStore((s) => s.user);
  const { id } = useParams<{ id: string }>();
  const [answerSort, setAnswerSort] = useState<"votes" | "newest">("votes");

  const {
    userProfile,
    stats,
    topQuestions,
    topAnswers,
    topTags,
    isLoading,
    fetchUserProfile,
    incrementProfileView,
    fetchTopAnswers,
    updateProfileViews,
  } = useProfileStore();

  const { joinRoom, leaveRoom, on, off } = useSocketStore();

  const profileUserId = id || currentUser?._id;

  useEffect(() => {
    if (profileUserId) {
      fetchUserProfile(profileUserId);
    }
  }, [profileUserId, fetchUserProfile]);

  useEffect(() => {
    // Chỉ tăng view khi mà user đang login đi xem profile của người khác bằng id trên URL
    if (id && currentUser?._id !== id) {
      incrementProfileView(id);
    }
  }, [id, currentUser, incrementProfileView]);

  // Real-time View Updates via Socket
  useEffect(() => {
    if (profileUserId) {
      const roomName = `user_${profileUserId}`;
      joinRoom(roomName);

      const handleViewUpdate = (data: { profileId: string; profileViews: number }) => {
        if (data.profileId === profileUserId) {
          updateProfileViews(data.profileId, data.profileViews);
        }
      };

      on("profile_view_updated", handleViewUpdate);

      return () => {
        leaveRoom(roomName);
        off("profile_view_updated", handleViewUpdate);
      };
    }
  }, [profileUserId, joinRoom, leaveRoom, on, off, updateProfileViews]);

  const isOwnProfile = !id || id === currentUser?._id;
  const user = isOwnProfile ? (userProfile || currentUser) : userProfile;

  const { error: profileError } = useProfileStore();

  if (profileError) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Lỗi tải hồ sơ</h2>
            <p className="text-slate-500 mb-4">{profileError}</p>
            <Link to="/" className="text-blue-600 font-semibold hover:underline">Quay về trang chủ</Link>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (profileUserId) {
      fetchTopAnswers(profileUserId, answerSort);
    }
  }, [profileUserId, answerSort, fetchTopAnswers]);

  if (isLoading || !userProfile) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      {/* Main Layout Container */}
      <div className="flex flex-1 max-w-[1240px] w-full mx-auto px-4 md:px-8 py-8 md:py-10">
        <main className="w-full">
          {/* Header Profile Section */}
          <ProfileHeader user={user} topTags={topTags} />

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
                        {stats.reputation ? stats.reputation.toLocaleString() : "0"}
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
                        {user.profileViews ? user.profileViews.toLocaleString() : "0"}
                      </span>
                      <Eye className="w-[20px] h-[20px] text-blue-500" strokeWidth={2.5} />
                    </div>
                    <span className="text-[14px] font-semibold text-slate-500">
                      Profile Views
                    </span>
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
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {topTags && topTags.length > 0 ? (
                    topTags.map((tag, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between"
                      >
                        <span className="px-3.5 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[14px] rounded-lg">
                          {tag.name}
                        </span>
                        <div className="flex gap-6 text-right">
                          <div>
                            <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-0.5">
                              Điểm
                            </div>
                            <div className="font-extrabold text-[16px] text-slate-800">
                              {tag.score}
                            </div>
                          </div>
                          <div>
                            <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-0.5">
                              Trả lời
                            </div>
                            <div className="font-extrabold text-[16px] text-slate-800">
                              {tag.answersCount}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-400 italic text-[14px]">
                      Chưa có nhãn nào nổi bật.
                    </div>
                  )}
                </div>
              </div>

              {/* Top Answers */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[20px] font-black text-slate-800">
                    Top Answers
                  </h2>
                  <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button
                      onClick={() => setAnswerSort("votes")}
                      className={`px-4 py-1.5 ${answerSort === 'votes' ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'} text-[13px] font-bold rounded-md transition-all`}
                    >
                      Votes
                    </button>
                    <button
                      onClick={() => setAnswerSort("newest")}
                      className={`px-4 py-1.5 ${answerSort === 'newest' ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'} text-[13px] font-bold rounded-md transition-all`}
                    >
                      Mới nhất
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {topAnswers && topAnswers.length > 0 ? (
                    topAnswers.map((answer, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row gap-5">
                        <div className="shrink-0 flex flex-col items-center">
                          <div className={`px-4 py-2 ${answer.isAccepted ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-slate-100 text-slate-700 border border-slate-200'} font-extrabold text-[17px] rounded-xl mb-1`}>
                            {answer.upvoteCount - answer.downvoteCount > 0 ? `+${answer.upvoteCount - answer.downvoteCount}` : answer.upvoteCount - answer.downvoteCount}
                          </div>
                          <span className="text-[13px] font-semibold text-slate-400">
                            votes
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link to={`/questions/${answer.quesId?._id}`}>
                            <h3 className="font-extrabold text-[18px] text-slate-800 leading-snug mb-2 hover:text-blue-600 cursor-pointer">
                              {answer.quesId?.title || "Câu hỏi đã bị xóa"}
                            </h3>
                          </Link>
                          <div
                            className="text-[14px] font-medium text-slate-500 mb-4 line-clamp-2 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: answer.content }}
                          />
                          <div className="flex flex-wrap items-center justify-between gap-y-3">
                            <div className="flex items-center gap-2">
                              {answer.quesId?.tags?.map((tag: any, tIdx: number) => (
                                <span key={tIdx} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[12px] font-bold rounded-md border border-slate-200">
                                  {tag.name}
                                </span>
                              ))}
                            </div>
                            <span className="text-[13px] font-semibold text-slate-400">
                              Trả lời {new Date(answer.createdAt).toLocaleDateString("vi-VN")}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-400 italic text-[14px]">
                      Người dùng chưa có câu trả lời nào.
                    </div>
                  )}

                  {/* View all answers btn */}
                  {stats.totalAnswers > 3 && (
                    <Link
                      to={`/profile/${profileUserId}/answers`}
                      className="w-full block text-center py-3.5 bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 font-bold text-[14px] rounded-xl transition-colors mt-2 cursor-pointer"
                    >
                      Xem tất cả {stats.totalAnswers} câu trả lời
                    </Link>
                  )}
                </div>
              </div>

              {/* Top Questions */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[20px] font-black text-slate-800">
                    Top Questions
                  </h2>
                  <Link
                    to={`/profile/${profileUserId}/questions`}
                    className="text-blue-600 font-bold text-[14px] hover:underline"
                  >
                    Xem tất cả
                  </Link>
                </div>

                <div className="flex flex-col gap-4">
                  {topQuestions && topQuestions.length > 0 ? (
                    topQuestions.map((ques, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between gap-5">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className={`w-[42px] h-[42px] rounded-xl font-black text-[18px] flex items-center justify-center border shrink-0 ${ques.status === 'resolved' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                            Q
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link to={`/questions/${ques._id}`} className="block mb-2">
                              <h3 className="font-extrabold text-[16px] text-slate-800 leading-snug hover:text-blue-600 cursor-pointer truncate">
                                {ques.title}
                              </h3>
                            </Link>
                            <div className="flex flex-wrap items-center gap-2">
                              {ques.tags?.map((tag: any, tIdx: number) => (
                                <span key={tIdx} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[11px] font-bold rounded border border-slate-200">
                                  {tag.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-8 shrink-0 hidden sm:flex">
                          <div className="flex flex-col text-center">
                            <span className="text-[13px] font-semibold text-slate-500">{ques.answersCount}</span>
                            <span className="text-[12px] font-medium text-slate-400">Trả lời</span>
                          </div>
                          <div className="flex flex-col text-center">
                            <span className="text-[13px] font-semibold text-slate-500">{ques.viewCount}</span>
                            <span className="text-[12px] font-medium text-slate-400">Lượt xem</span>
                          </div>
                          <div className="font-extrabold text-[15px] text-green-600 w-[60px] text-right">
                            {ques.upvoteCount - ques.downvoteCount > 0 ? `+${ques.upvoteCount - ques.downvoteCount}` : ques.upvoteCount - ques.downvoteCount}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-400 italic text-[14px]">
                      Người dùng chưa hỏi câu nào.
                    </div>
                  )}
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
