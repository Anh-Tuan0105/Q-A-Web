import React from "react";
import { type Member } from "./member";
import { MapPin, ShieldCheck } from "lucide-react";

interface MemberCardProps {
  member: Member;
}

const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all duration-300 flex flex-col items-center">
      {/* Avatar & Badge */}
      <div className="relative mb-3">
        <img
          src={member.avatar}
          alt={member.name}
          className="w-20 h-20 rounded-full object-cover border-4 border-transparent shadow-[0_0_0_2px_#EFF6FF] p-0.5"
        />
        {member.isVip && (
          <span className="absolute bottom-0 right-0 bg-yellow-400 text-white p-1 rounded-full text-[10px] shadow-sm flex items-center justify-center w-5 h-5 border-2 border-white">
            ★
          </span>
        )}
        {!member.isVip && member.id === 3 && (
            <span className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full shadow-sm flex items-center justify-center w-5 h-5 border-2 border-white">
               <ShieldCheck size={10} strokeWidth={3}/>
            </span>
        )}
      </div>

      {/* Info */}
      <h3 className="font-bold text-gray-800 text-lg mb-0.5">{member.name}</h3>
      <p className="text-gray-400 text-[13px] flex items-center gap-1 mb-5">
        <MapPin size={14} className="text-gray-400" /> {member.location}
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
      <div className="flex flex-wrap gap-2 justify-center">
        {member.tags.map((tag) => (
          <span
            key={tag}
            className="bg-gray-50/80 border border-gray-100 text-gray-500 px-2.5 py-1 rounded-[6px] text-[11px] font-medium hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 cursor-pointer transition-colors"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MemberCard;
