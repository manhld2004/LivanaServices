require('dotenv').config();

const express = require('express');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const cors = require('cors');

// --- Cấu hình ---
const app = express();
app.use(express.json());
app.use(cors()); // Cho phép tất cả các domain (chỉ nên dùng cho development)

// Khởi tạo Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Khóa bí mật để ký JWT của bạn. Giữ nó an toàn và không public.
// Trong môi trường production, nên dùng biến môi trường (environment variable).
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

if (!JWT_SECRET_KEY) {
    console.error("FATAL ERROR: JWT_SECRET_KEY is not defined.");
    process.exit(1); // Thoát ứng dụng nếu không có khóa bí mật
}

// --- Endpoint ---

/**
 * Endpoint để đổi Firebase ID Token lấy JWT tùy chỉnh.
 * Client gửi Firebase ID Token trong header "Authorization: Bearer <token>"
 */
app.post('/auth/exchange-token', async (req, res) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return res.status(401).send({ error: 'Unauthorized: Missing or invalid token.' });
    }

    const idToken = authorizationHeader.split('Bearer ')[1];

    try {
        // 1. Xác thực Firebase ID Token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;
        const email = decodedToken.email;

        // (Tùy chọn) Bạn có thể lấy thêm thông tin user từ database của bạn ở đây nếu cần

        // 2. Tạo JWT tùy chỉnh của riêng bạn
        // Payload có thể chứa bất kỳ thông tin nào bạn muốn, ví dụ: uid, role, ...
        const payload = {
            uid: uid,
            email: email,
            // exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // Hết hạn sau 1 ngày
        };

        const customJwt = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1d' });

        // 3. Trả về JWT cho client
        res.status(200).send({ jwt: customJwt });

    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(403).send({ error: 'Forbidden: Invalid token.' });
    }
});


// --- Khởi động Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Auth service is running on port ${PORT}`);
});