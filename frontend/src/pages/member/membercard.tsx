import React from "react";
import { type Member } from "./member";
import { MapPin } from "lucide-react";
import { Link } from "react-router";

interface MemberCardProps {
  member: Member;
}

const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  return (
    <Link 
      to={`/profile/${member._id}`}
      className="bg-white p-6 rounded-xl border border-blue-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all duration-300 flex flex-col items-center group cursor-pointer"
    >
      {/* Avatar */}
      <div className="relative mb-3">
        <img
          src={member.avatarUrl || `https://ui-avatars.com/api/?name=${member.displayName || member.userName}&background=random`}
          alt={member.displayName}
          className="w-20 h-20 rounded-full object-cover border-4 border-transparent shadow-[0_0_0_2px_#EFF6FF] p-0.5 group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Info */}
      <h3 className="font-bold text-gray-800 text-lg mb-0.5 group-hover:text-blue-600 transition-colors line-clamp-1">{member.displayName}</h3>
      <p className="text-gray-400 text-[13px] flex items-center gap-1 mb-5 line-clamp-1">
        <MapPin size={14} className="text-gray-400" /> {member.location || "Chưa cập nhật"}
      </p>

      {/* Stats Table-like */}
      <div className="flex w-full py-3 mb-5 border-t border-b border-gray-100/80">
        <div className="flex-1 text-center border-r border-gray-100/80">
          <p className="text-blue-500 font-bold text-[15px]">
            {member.reputation.toLocaleString("en-US")}
          </p>
          <p className="text-[10px] uppercase text-gray-400 font-semibold tracking-wide">
            Uy tín
          </p>
        </div>
        <div className="flex-1 text-center">
          <p className="text-gray-700 font-bold text-[15px]">{member.postCount}</p>
          <p className="text-[10px] uppercase text-gray-400 font-semibold tracking-wide">
            Bài viết
          </p>
        </div>
      </div>

      {/* Tags List */}
      <div className="flex flex-wrap gap-1.5 justify-center">
        {member.topTags && member.topTags.length > 0 ? (
          member.topTags.map((tag) => (
            <span
              key={tag._id}
              className="bg-slate-50 border border-slate-100 text-slate-500 px-2 py-0.5 rounded-md text-[10px] font-bold hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-colors"
            >
              {tag.name}
            </span>
          ))
        ) : (
          <span className="text-[10px] text-slate-400 font-medium">Chưa có hoạt động</span>
        )}
      </div>

      {/* Bio / JobTitle */}
      {member.jobTitle && (
        <div className="mt-4 text-center">
          <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider line-clamp-1">
            {member.jobTitle}
          </span>
        </div>
      )}
    </Link>
  );
};

export default MemberCard;
