PROJECT OVERVIEW
🎓 Online Quiz & Exam Management Backend

Ye project ek production-ready backend system hai jo online exams / quizzes conduct karne ke liye banaya gaya hai.
System role-based hai (Admin / Teacher / Student) aur real-world exam scenarios handle karta hai jaise:

Secure login & authorization

Quiz creation by teachers

Student exam attempts

Timer-based submission

Anti-cheating hooks

Scalable deployment on cloud

Project ko real production environment me deploy karke debug kiya gaya hai (Render + MongoDB Atlas).

👉 Focus sirf features par nahi, balki production stability & debugging par bhi hai.

🛠️ TECH STACK
🔹 Backend

Node.js – JavaScript runtime

Fastify – High-performance backend framework

JWT (JSON Web Token) – Authentication & authorization

bcryptjs – Password hashing

🔹 Database

MongoDB Atlas – Cloud NoSQL database

Mongoose – ODM for MongoDB

🔹 Cache / Optimization

Redis (Optional / Feature-flag based)

Exam timer optimization

Disabled gracefully on free hosting tier

🔹 DevOps / Deployment

Render.com – Cloud deployment (production)

GitHub – Version control

dotenv – Environment configuration

🔌 API LIST (IMPORTANT)
🔐 AUTH MODULE
Method	Endpoint	Description
POST	/api/auth/register	User registration
POST	/api/auth/login	User login (JWT)
👨‍🏫 QUIZ MODULE (Teacher)
Method	Endpoint	Description
POST	/api/quiz	Create quiz
POST	/api/quiz/:quizId/question	Add question
👨‍🎓 EXAM / ATTEMPT MODULE (Student)
Method	Endpoint	Description
POST	/api/attempt/start/:quizId	Start exam
POST	/api/attempt/:quizId/answer	Submit answer
POST	/api/attempt/submit/:quizId	Final submit
🛡️ ANTI-CHEATING (Hook Ready)
Method	Endpoint	Description
POST	/api/cheat/violation	Log tab switch / refresh
🧪 HEALTH CHECK
Method	Endpoint
GET	/
