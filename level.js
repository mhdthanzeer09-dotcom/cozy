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
            link: `stories/${level.toLowerCase()}-story${i}.html`
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

const urlParams = new URLSearchParams(window.location.search);
const level = urlParams.get('level') || 'A1';

document.addEventListener("DOMContentLoaded", () => {
    if (!authManager.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    const user = authManager.getCurrentUser();
    document.getElementById('userName').textContent = user.name;
    document.getElementById('levelTitle').textContent = `Level ${level} (${storyMappings[level].length} Stories)`;

    renderStories();
});

function renderStories() {
    const stories = storyMappings[level] || [];
    const grid = document.getElementById('storiesGrid');

    grid.innerHTML = stories.map(story => {
        return `
            <a href="${story.link}" class="story-card">
                <div class="story-number">${story.number}</div>
                <div class="story-content">
                    <h3>${story.title}</h3>
                    <p>${story.subtitle}</p>
                </div>
            </a>
        `;
    }).join('');
}