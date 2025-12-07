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
    console.log('---------------------------------');
    console.log('Received a request on /auth/exchange-token');

    const authorizationHeader = req.headers.authorization;
    console.log('1. Authorization Header:', authorizationHeader); // Log header nhận được

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        console.log('Request failed: Missing or invalid Authorization header.');
        return res.status(401).send({ error: 'Unauthorized: Missing or invalid token.' });
    }

    const idToken = authorizationHeader.split('Bearer ')[1];
    console.log('2. Extracted ID Token (first 30 chars):', idToken.substring(0, 30)); // Log một phần token

    try {
        console.log('3. Attempting to verify token with Firebase...'); // Log ngay trước khi gọi await
        
        // Dòng này có thể đang bị treo
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        
        console.log('4. Token verified successfully! UID:', decodedToken.uid); // Log sau khi thành công

        const uid = decodedToken.uid;
        const email = decodedToken.email;

        // ... code tạo JWT ...
        const payload = { uid, email };
        const customJwt = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1d' });

        console.log('5. Returning custom JWT to client.');
        res.status(200).send({ jwt: customJwt });

    } catch (error) {
        console.error('VERIFICATION FAILED:', error); // Log lỗi chi tiết
        return res.status(403).send({ error: 'Forbidden: Invalid token.' });
    }
});


// --- Khởi động Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Auth service is running on port ${PORT}`);
});