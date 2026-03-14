/**
 * Script để generate embedding cho các câu hỏi cũ trong DB chưa có embedding
 * Chạy một lần: node src/scripts/migrate-embeddings.js
 */
// AI gemini 3 pro
import dotenv from 'dotenv';
import { connectDB } from '../lib/db.js';
import Question from '../models/Question.js';
import { generateEmbedding } from '../services/ai.service.js';

dotenv.config();

const BATCH_SIZE = 10; // Xử lý 10 câu hỏi mỗi lần để tránh rate limit

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const migrateEmbeddings = async () => {
    await connectDB();
    console.log('🚀 Bắt đầu migration embeddings...\n');

    // Lấy các câu hỏi chưa có embedding
    const questions = await Question.find({
        $or: [
            { embedding: { $exists: false } },
            { embedding: { $size: 0 } },
        ]
    }).select('_id title');

    console.log(`📊 Tìm thấy ${questions.length} câu hỏi cần tạo embedding.\n`);

    let success = 0;
    let failed = 0;

    for (let i = 0; i < questions.length; i += BATCH_SIZE) {
        const batch = questions.slice(i, i + BATCH_SIZE);
        console.log(`🔄 Đang xử lý batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(questions.length / BATCH_SIZE)}...`);

        for (const question of batch) {
            const embedding = await generateEmbedding(question.title);
            if (embedding) {
                await Question.updateOne({ _id: question._id }, { $set: { embedding } });
                success++;
                process.stdout.write(`  ✅ "${question.title.substring(0, 60)}"\n`);
            } else {
                failed++;
                process.stdout.write(`  ❌ FAILED: "${question.title.substring(0, 60)}"\n`);
            }
        }

        // Delay 1 giây giữa mỗi batch để tránh rate limit
        if (i + BATCH_SIZE < questions.length) {
            await delay(1000);
        }
    }

    console.log(`\n✅ Migration hoàn tất: ${success} thành công, ${failed} thất bại.`);
    process.exit(0);
};

migrateEmbeddings().catch(err => {
    console.error('🔴 Migration lỗi:', err);
    process.exit(1);
});
