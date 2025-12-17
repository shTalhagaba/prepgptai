import admin from "firebase-admin";
import { readFileSync } from "fs";
import { join } from "path";

// Initialize Firebase Admin
const serviceAccount = JSON.parse(
  readFileSync(
    join(__dirname, "../../Downloads/ai-interview-91da9-firebase-adminsdk-fbsvc-dc0baebf6a.json"),
    "utf8"
  )
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const sampleInterviews = [
  {
    role: "Frontend Developer",
    type: "Technical",
    level: "Junior",
    techstack: ["React", "JavaScript", "HTML", "CSS"],
    questions: [
      "What is the virtual DOM in React and how does it work?",
      "Explain the difference between let, const, and var in JavaScript.",
      "What are React hooks and when would you use them?",
      "How do you handle responsive design in CSS?",
      "What is the box model in CSS?",
    ],
    userId: "sample-user-1",
    finalized: true,
    coverImage: "/covers/facebook.png",
    createdAt: new Date().toISOString(),
  },
  {
    role: "Backend Developer",
    type: "Technical",
    level: "Mid-Level",
    techstack: ["Node.js", "Express", "MongoDB", "PostgreSQL"],
    questions: [
      "Explain the concept of middleware in Express.js.",
      "What is the difference between SQL and NoSQL databases?",
      "How do you handle authentication and authorization in a Node.js application?",
      "Describe the event loop in Node.js.",
      "What are indexes in databases and why are they important?",
    ],
    userId: "sample-user-2",
    finalized: true,
    coverImage: "/covers/amazon.png",
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    role: "Full Stack Developer",
    type: "Mixed",
    level: "Senior",
    techstack: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
    questions: [
      "How would you architect a scalable web application?",
      "Describe your experience with CI/CD pipelines.",
      "How do you approach code reviews and mentoring junior developers?",
      "Explain the importance of testing in software development.",
      "What strategies do you use for database optimization?",
      "How do you handle conflicts in a development team?",
      "Describe a challenging project you led and how you managed it.",
    ],
    userId: "sample-user-3",
    finalized: true,
    coverImage: "/covers/adobe.png",
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  },
  {
    role: "DevOps Engineer",
    type: "Technical",
    level: "Mid-Level",
    techstack: ["Docker", "Kubernetes", "AWS", "Jenkins", "Terraform"],
    questions: [
      "What is containerization and how does Docker work?",
      "Explain the difference between Docker and Kubernetes.",
      "How do you implement continuous integration and deployment?",
      "What is Infrastructure as Code and why is it important?",
      "Describe your experience with cloud platforms like AWS or Azure.",
    ],
    userId: "sample-user-4",
    finalized: true,
    coverImage: "/covers/spotify.png",
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
  },
  {
    role: "Data Scientist",
    type: "Technical",
    level: "Senior",
    techstack: ["Python", "TensorFlow", "Pandas", "SQL", "Machine Learning"],
    questions: [
      "Explain the difference between supervised and unsupervised learning.",
      "What is overfitting and how do you prevent it?",
      "Describe your experience with neural networks and deep learning.",
      "How do you evaluate the performance of a machine learning model?",
      "What is feature engineering and why is it important?",
      "Explain the concept of cross-validation.",
    ],
    userId: "sample-user-5",
    finalized: true,
    coverImage: "/covers/pinterest.png",
    createdAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
  },
  {
    role: "UI/UX Designer",
    type: "Behavioral",
    level: "Mid-Level",
    techstack: ["Figma", "Adobe XD", "Sketch", "Photoshop"],
    questions: [
      "How do you approach user research and gathering requirements?",
      "Describe a time when you had to balance user needs with business goals.",
      "How do you handle feedback and criticism on your designs?",
      "What is your design process from concept to final product?",
      "How do you collaborate with developers to implement your designs?",
    ],
    userId: "sample-user-6",
    finalized: true,
    coverImage: "/covers/telegram.png",
    createdAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
  },
  {
    role: "Mobile Developer",
    type: "Technical",
    level: "Junior",
    techstack: ["React Native", "JavaScript", "Firebase", "Redux"],
    questions: [
      "What is React Native and how does it differ from native development?",
      "Explain the concept of state management in React Native.",
      "How do you handle navigation in a React Native app?",
      "What are the main differences between iOS and Android development?",
      "How do you optimize performance in mobile applications?",
    ],
    userId: "sample-user-7",
    finalized: true,
    coverImage: "/covers/tiktok.png",
    createdAt: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
  },
  {
    role: "Product Manager",
    type: "Behavioral",
    level: "Senior",
    techstack: ["Jira", "Agile", "Scrum", "Product Strategy"],
    questions: [
      "How do you prioritize features in a product roadmap?",
      "Describe a time when you had to make a difficult product decision.",
      "How do you measure the success of a product?",
      "What is your approach to gathering and incorporating user feedback?",
      "How do you handle conflicts between stakeholders?",
      "Describe your experience with agile methodologies.",
      "How do you work with cross-functional teams?",
    ],
    userId: "sample-user-8",
    finalized: true,
    coverImage: "/covers/skype.png",
    createdAt: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
  },
];

async function addSampleInterviews() {
  console.log("🚀 Starting to add sample interviews...\n");

  try {
    const batch = db.batch();

    for (const interview of sampleInterviews) {
      const docRef = db.collection("interviews").doc();
      batch.set(docRef, interview);
      console.log(`✅ Added: ${interview.role} (${interview.level}) - ${interview.type}`);
    }

    await batch.commit();
    console.log(`\n🎉 Successfully added ${sampleInterviews.length} sample interviews!`);
  } catch (error) {
    console.error("❌ Error adding sample interviews:", error);
  } finally {
    admin.app().delete();
  }
}

addSampleInterviews();
