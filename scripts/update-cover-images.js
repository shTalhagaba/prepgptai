const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// Initialize Firebase Admin
const serviceAccountPath = path.join(
    "C:",
    "Users",
    "enovo",
    "Downloads",
    "ai-interview-91da9-firebase-adminsdk-fbsvc-dc0baebf6a.json"
);

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Map of old incorrect paths to new correct paths
const coverImageUpdates = {
    "/react.png": "/covers/facebook.png",
    "/nodejs.png": "/covers/amazon.png",
    "/typescript.png": "/covers/adobe.png",
    "/docker.png": "/covers/spotify.png",
    "/python.png": "/covers/pinterest.png",
    "/figma.png": "/covers/telegram.png",
    "/quora.png": "/covers/skype.png",
};

async function updateCoverImages() {
    console.log("🔧 Starting to update cover images...\n");

    try {
        // Get all interviews with sample user IDs
        const snapshot = await db
            .collection("interviews")
            .where("userId", ">=", "sample-user-1")
            .where("userId", "<=", "sample-user-9")
            .get();

        if (snapshot.empty) {
            console.log("No sample interviews found.");
            admin.app().delete();
            return;
        }

        const batch = db.batch();
        let updateCount = 0;

        snapshot.forEach((doc) => {
            const data = doc.data();
            const oldCover = data.coverImage;

            if (oldCover && coverImageUpdates[oldCover]) {
                const newCover = coverImageUpdates[oldCover];
                batch.update(doc.ref, { coverImage: newCover });
                console.log(`✅ Updating ${data.role}: ${oldCover} → ${newCover}`);
                updateCount++;
            } else if (oldCover && !oldCover.startsWith("/covers/")) {
                // If there's a cover but not in /covers/, use a default
                batch.update(doc.ref, { coverImage: "/covers/reddit.png" });
                console.log(`✅ Updating ${data.role}: ${oldCover} → /covers/reddit.png`);
                updateCount++;
            }
        });

        if (updateCount > 0) {
            await batch.commit();
            console.log(`\n🎉 Successfully updated ${updateCount} cover images!`);
        } else {
            console.log("\nℹ️ No updates needed - all cover images are correct!");
        }
    } catch (error) {
        console.error("❌ Error updating cover images:", error);
    } finally {
        admin.app().delete();
    }
}

updateCoverImages();
