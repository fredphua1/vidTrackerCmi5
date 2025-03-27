document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('videoPlayer');
    const chapterButtons = document.querySelectorAll('.chapter-btn');

    // Initialize CMI5 tracking
    const tracker = new CMI5Tracker();
    tracker.init(video);

    // Function to update active chapter button
    function updateActiveChapter(currentTime) {
        chapterButtons.forEach(btn => {
            const time = parseInt(btn.dataset.time);
            if (currentTime >= time) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // Add click event listeners to chapter buttons
    chapterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const time = parseInt(this.dataset.time);
            video.currentTime = time;
            video.play();
        });
    });

    // Update active chapter as video plays
    video.addEventListener('timeupdate', function() {
        updateActiveChapter(video.currentTime);
    });

    // Update active chapter when video is loaded
    video.addEventListener('loadedmetadata', function() {
        updateActiveChapter(0);
    });
}); 