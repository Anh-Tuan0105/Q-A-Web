import User from "../models/User.js";
import Answer from "../models/Answer.js";

/**
 * Tính toán lại reputation của người dùng dựa trên các lượt vote của tất cả câu trả lời
 * và cập nhật trực tiếp vào trường reputation trong model User.
 * @param {string} userId - ID của người dùng cần cập nhật
 */
export const updateUserReputation = async (userId) => {
    try {
        const answerVotes = await Answer.aggregate([
            { $match: { userId: userId } },
            { $group: { _id: null, total: { $sum: { $subtract: ["$upvoteCount", "$downvoteCount"] } } } }
        ]);

        const realReputation = answerVotes[0]?.total || 0;

        await User.findByIdAndUpdate(userId, { reputation: realReputation });
        console.log(`[ReputationSync] Updated user ${userId} to ${realReputation}`);
        
        return realReputation;
    } catch (error) {
        console.error(`[ReputationSync] Error updating reputation for user ${userId}:`, error);
        throw error;
    }
};
