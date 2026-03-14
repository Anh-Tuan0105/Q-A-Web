import dotenv from 'dotenv';
import { connectDB } from '../lib/db.js';
import { findSimilarQuestions } from '../services/similarity.service.js';
import mongoose from 'mongoose';

dotenv.config();

const runTest = async () => {
    try {
        await connectDB();
        console.log('--- Đang kiểm tra gợi ý câu hỏi cho: "cải thiện tốc độ react" ---');
        
        const results = await findSimilarQuestions('cải thiện tốc độ react');
        
        console.log(`Tìm thấy ${results.length} kết quả:`);
        results.forEach((q, i) => {
            console.log(`${i + 1}. [${(q.similarity * 100).toFixed(1)}%] ${q.title}`);
        });

        if (results.some(q => q.title.toLowerCase().includes('c++'))) {
            console.log('❌ THẤT BẠI: Vẫn còn câu hỏi không liên quan (C++).');
        } else if (results.length > 0) {
            console.log('✅ THÀNH CÔNG: Chỉ hiển thị các câu hỏi có độ tương đồng cao.');
        } else {
            console.log('ℹ️ Không tìm thấy câu hỏi nào đủ tương đồng.');
        }

    } catch (error) {
        console.error('Lỗi khi chạy test:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

runTest();
