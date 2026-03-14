/**
 * Generates a modern HTML email template for OTP verification.
 * Designed for readability, professional look, and responsive compatibility.
 */
export const getOTPTemplate = (otp, displayName) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác thực mã OTP - DevCommunity</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f7fa;
            color: #334155;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        .header {
            background-color: #137FEC;
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 28px;
            font-weight: 800;
            letter-spacing: -0.5px;
        }
        .content {
            padding: 40px;
            text-align: center;
        }
        .greeting {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 16px;
            color: #0f172a;
        }
        .message {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
            color: #475569;
        }
        .otp-container {
            background-color: #f8fafc;
            border: 2px dashed #cbd5e1;
            border-radius: 12px;
            padding: 24px;
            margin: 30px 0;
            display: inline-block;
            min-width: 200px;
        }
        .otp-code {
            font-size: 42px;
            font-weight: 800;
            color: #137FEC;
            letter-spacing: 8px;
            margin: 0;
        }
        .footer {
            padding: 30px;
            background-color: #f8fafc;
            text-align: center;
            font-size: 14px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
        }
        .expiry {
            color: #ef4444;
            font-weight: 600;
            margin-top: 10px;
        }
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background-color: #137FEC;
            color: #ffffff;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin-top: 20px;
        }
        @media only screen and (max-width: 600px) {
            .container {
                margin: 20px 10px;
            }
            .content {
                padding: 30px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>DevCommunity</h1>
        </div>
        <div class="content">
            <div class="greeting">Xin chào ${displayName || 'bạn'},</div>
            <div class="message">
                Bạn đã yêu cầu thay đổi email cho tài khoản của mình. 
                Vui lòng sử dụng mã OTP dưới đây để xác thực hành động này:
            </div>
            
            <div class="otp-container">
                <div class="otp-code">${otp}</div>
            </div>
            
            <div class="expiry">Mã này sẽ hết hạn sau 1 phút.</div>
            
            <div class="message" style="margin-top: 30px; font-size: 14px;">
                Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này hoặc liên hệ với bộ phận hỗ trợ nếu bạn thấy có hoạt động đáng ngờ.
            </div>
        </div>
        <div class="footer">
            &copy; 2024 DevCommunity. All rights reserved.<br>
            Cộng đồng lập trình viên lớn nhất Việt Nam.
        </div>
    </div>
</body>
</html>
    `;
};
