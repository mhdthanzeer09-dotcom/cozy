const proficiencyLevels = [
    { level: "A1", name: "Beginner", color: "#3b82f6", description: "Learn basic German vocabulary and simple sentences" },
    { level: "A2", name: "Elementary", color: "#10b981", description: "Build on basic skills with more complex vocabulary" },
    { level: "B1", name: "Intermediate", color: "#f59e0b", description: "Understand and express yourself in most situations" },
    { level: "B2", name: "Upper Intermediate", color: "#ec4899", description: "Communicate fluently and spontaneously" },
    { level: "C1", name: "Advanced", color: "#8b5cf6", description: "Express yourself fluently and spontaneously" },
    { level: "C2", name: "Mastery", color: "#dc2626", description: "Understand with ease virtually everything you read or hear" }
];

function generateStories(level, count = 100) {
    const stories = [];
    const topics = ["Mein Abend", "Ein Morgen", "Auf dem Markt", "Im Park", "Am See", "Die Schule", "Meine Familie", "Im Restaurant", "Das Wetter", "Einkaufen"];
    const subtopics = ["Part I", "Part II", "Part III", "Kapitel 1", "Kapitel 2", "Einführung", "Grundlagen", "Vertiefung", "Perspektive A", "Perspektive B"];

    for (let i = 1; i <= count; i++) {
        const topicIndex = (i - 1) % topics.length;
        const subtopicIndex = Math.floor((i - 1) / topics.length) % subtopics.length;
        
        stories.push({
            id: `${level.toLowerCase()}-story${i}`,
            number: i,
            title: `${topics[topicIndex]} ${subtopics[subtopicIndex]}`,
            subtitle: `Story ${i}`,
            link: `s/${level.toLowerCase()}-story${i}.html`
        });
    }

    return stories;
}

const storyMappings = {
    "A1": generateStories("A1", 100),
    "A2": generateStories("A2", 100),
    "B1": generateStories("B1", 100),
    "B2": generateStories("B2", 100),
    "C1": generateStories("C1", 100),
    "C2": generateStories("C2", 100)
};

document.addEventListener("DOMContentLoaded", () => {
    if (typeof authManager === 'undefined' || !authManager.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    const user = authManager.getCurrentUser();
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userEmail').textContent = user.email;

    document.getElementById('logoutBtn').addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
            authManager.logout();
            window.location.href = 'login.html';
        }
    });

    renderLevels();
});

function renderLevels() {
    const section = document.getElementById("levelsSection");
    section.innerHTML = proficiencyLevels.map(level => {
        const storyCount = storyMappings[level.level].length;
        return `
            <div class="level-card">
                <div class="level-badge" style="background: ${level.color}">
                    ${level.level}
                </div>
                <div class="level-content">
                    <div class="level-header-info">
                        <h2 class="level-name">${level.name}</h2>
                        <p class="level-desc">${level.description}</p>
                        <p class="story-count">${storyCount} Stories</p>
                    </div>
                    <a href="level.html?level=${level.level}" class="btn-enter" style="border-color: ${level.color}; color: ${level.color}">
                        Enter Level →
                    </a>
                </div>
            </div>
        `;
    }).join("");
}
