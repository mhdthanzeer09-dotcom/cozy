// Admin Panel Logic

let allUsers = {};
let filteredUsers = {};
let selectedUserEmail = null;

// Story configuration
const storyInfo = {
    "a1-story1": "A1 - Mein Abend",
    "a1-story2": "A1 - Ein Morgen im Dorf",
    "a1-story3": "A1 - Auf dem Markt",
    "a1-story4": "A1 - Im Park",
    "a1-story5": "A1 - Am See",
    "a2-story1": "A2 - Die Schule",
    "a2-story2": "A2 - Meine Familie",
    "a2-story3": "A2 - Im Restaurant",
    "a2-story4": "A2 - Das Wetter",
    "a2-story5": "A2 - Einkaufen",
    "b1-story1": "B1 - Ein Wochenende",
    "b1-story2": "B1 - Reisen",
    "b1-story3": "B1 - Hobbys",
    "b1-story4": "B1 - Beruf",
    "b1-story5": "B1 - Freundschaft",
    "b2-story1": "B2 - Kultur",
    "b2-story2": "B2 - Umwelt",
    "b2-story3": "B2 - Technologie",
    "b2-story4": "B2 - Geschichte",
    "b2-story5": "B2 - Wissenschaft",
    "c1-story1": "C1 - Philosophie",
    "c1-story2": "C1 - Literatur",
    "c1-story3": "C1 - Künstlerische Ausdrucksformen",
    "c1-story4": "C1 - Gesellschaftsfragen",
    "c1-story5": "C1 - Persönliche Entwicklung",
    "c2-story1": "C2 - Metaphysik",
    "c2-story2": "C2 - Existenzialismus",
    "c2-story3": "C2 - Postmodernismus",
    "c2-story4": "C2 - Kulturelle Nuancen",
    "c2-story5": "C2 - Fortgeschrittene Diskurse"
};

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    loadUsers();
    setupSearch();
});

function loadUsers() {
    allUsers = JSON.parse(localStorage.getItem('users')) || {};
    filteredUsers = { ...allUsers };
    
    document.getElementById('totalUsers').textContent = Object.keys(allUsers).length;
    renderUsersTable();
}

function renderUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    
    if (Object.keys(filteredUsers).length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #9ca3af;">No users found</td></tr>';
        return;
    }

    tbody.innerHTML = Object.entries(filteredUsers).map(([email, user]) => {
        const stats = calculateUserStats(user);
        return `
            <tr>
                <td>${user.name}</td>
                <td>${email}</td>
                <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                <td>${stats.totalWords}</td>
                <td>${stats.completedStories}/${stats.totalStories}</td>
                <td>
                    <div class="progress-bar-mini">
                        <div class="progress-fill-mini" style="width: ${stats.progress}%"></div>
                    </div>
                    ${Math.round(stats.progress)}%
                </td>
                <td><button class="btn-view" onclick="viewUserDetails('${email}')">View</button></td>
            </tr>
        `;
    }).join('');
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        filteredUsers = {};
        
        Object.entries(allUsers).forEach(([email, user]) => {
            if (user.name.toLowerCase().includes(query) || email.toLowerCase().includes(query)) {
                filteredUsers[email] = user;
            }
        });
        
        renderUsersTable();
    });
}

function calculateUserStats(user) {
    let totalWords = 0;
    let completedStories = 0;
    let totalStories = 30;
    let totalAvailableWords = 0;

    // Calculate word counts for all stories
    const wordCounts = {
        "a1-story1": 7, "a1-story2": 8, "a1-story3": 10, "a1-story4": 11, "a1-story5": 8,
        "a2-story1": 12, "a2-story2": 13, "a2-story3": 14, "a2-story4": 11, "a2-story5": 15,
        "b1-story1": 16, "b1-story2": 18, "b1-story3": 17, "b1-story4": 19, "b1-story5": 16,
        "b2-story1": 20, "b2-story2": 22, "b2-story3": 21, "b2-story4": 23, "b2-story5": 20,
        "c1-story1": 25, "c1-story2": 27, "c1-story3": 26, "c1-story4": 28, "c1-story5": 25,
        "c2-story1": 30, "c2-story2": 32, "c2-story3": 31, "c2-story4": 33, "c2-story5": 30
    };

    Object.entries(wordCounts).forEach(([storyId, wordCount]) => {
        totalAvailableWords += wordCount;
        const learnedWords = user.progress[storyId]?.words || [];
        totalWords += learnedWords.length;
        
        if (learnedWords.length === wordCount) {
            completedStories++;
        }
    });

    const progress = (totalWords / totalAvailableWords) * 100;

    return { totalWords, completedStories, totalStories, progress };
}

function viewUserDetails(email) {
    selectedUserEmail = email;
    const user = allUsers[email];
    const stats = calculateUserStats(user);

    document.getElementById('modalUserName').textContent = user.name + ' - Details';
    document.getElementById('modalName').textContent = user.name;
    document.getElementById('modalEmail').textContent = email;
    document.getElementById('modalJoined').textContent = new Date(user.createdAt).toLocaleDateString();
    document.getElementById('modalTotalWords').textContent = stats.totalWords;
    document.getElementById('modalStoriesCompleted').textContent = `${stats.completedStories}/${stats.totalStories}`;
    document.getElementById('modalOverallProgress').textContent = Math.round(stats.progress);

    // Render story progress
    const storyProgressList = document.getElementById('storyProgressList');
    storyProgressList.innerHTML = Object.entries(storyInfo).map(([storyId, storyName]) => {
        const learned = user.progress[storyId]?.words || [];
        const total = getStoryWordCount(storyId);
        const progress = (learned.length / total) * 100;

        return `
            <div class="story-item">
                <div class="story-item-name">${storyName}</div>
                <div class="story-item-progress">${learned.length}/${total} words (${Math.round(progress)}%)</div>
            </div>
        `;
    }).join('');

    document.getElementById('userModal').classList.add('show');
}

function closeUserModal() {
    document.getElementById('userModal').classList.remove('show');
    selectedUserEmail = null;
}

function getStoryWordCount(storyId) {
    const wordCounts = {
        "a1-story1": 7, "a1-story2": 8, "a1-story3": 10, "a1-story4": 11, "a1-story5": 8,
        "a2-story1": 12, "a2-story2": 13, "a2-story3": 14, "a2-story4": 11, "a2-story5": 15,
        "b1-story1": 16, "b1-story2": 18, "b1-story3": 17, "b1-story4": 19, "b1-story5": 16,
        "b2-story1": 20, "b2-story2": 22, "b2-story3": 21, "b2-story4": 23, "b2-story5": 20,
        "c1-story1": 25, "c1-story2": 27, "c1-story3": 26, "c1-story4": 28, "c1-story5": 25,
        "c2-story1": 30, "c2-story2": 32, "c2-story3": 31, "c2-story4": 33, "c2-story5": 30
    };
    return wordCounts[storyId] || 0;
}

function deleteUser() {
    if (!selectedUserEmail) return;
    
    if (confirm(`Are you sure you want to delete user: ${allUsers[selectedUserEmail].name}?\n\nThis action cannot be undone!`)) {
        delete allUsers[selectedUserEmail];
        localStorage.setItem('users', JSON.stringify(allUsers));
        loadUsers();
        closeUserModal();
        alert('User deleted successfully');
    }
}

function resetUserProgress() {
    if (!selectedUserEmail) return;
    
    if (confirm(`Reset all progress for ${allUsers[selectedUserEmail].name}?`)) {
        allUsers[selectedUserEmail].progress = {};
        localStorage.setItem('users', JSON.stringify(allUsers));
        loadUsers();
        closeUserModal();
        alert('User progress reset successfully');
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('userModal');
    if (event.target === modal) {
        closeUserModal();
    }
}