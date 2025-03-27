class CMI5Tracker {
    constructor() {
        this.lrsEndpoint = 'https://watershedlrs.com/api/organizations/26963/lrs/'; // Replace with your LRS endpoint
        this.actor = {
            "mbox": "mailto:fred@intuity.sg", // Replace with actual user email
            "name": "Vid Tracker" // Replace with actual user name
        };
        this.registration = "reg_vidtracker1"; // Replace with actual registration ID
        this.activityId = "id_vidtracker1"; // Replace with your activity ID
        this.chaptersWatched = new Set();
        this.videoDuration = 0;
        this.lastPosition = 0;
        this.completionThreshold = 0.9; // 90% of video needs to be watched for completion
    }

    // Initialize tracking
    init(videoElement) {
        this.video = videoElement;
        this.videoDuration = this.video.duration;
        
        // Track video progress
        this.video.addEventListener('timeupdate', () => this.trackProgress());
        
        // Track chapter completion
        this.video.addEventListener('timeupdate', () => this.trackChapters());
    }

    // Track overall video progress
    trackProgress() {
        const currentTime = this.video.currentTime;
        const progress = currentTime / this.videoDuration;
        
        // Send progress statement
        if (progress - this.lastPosition >= 0.1) { // Send every 10% progress
            this.sendStatement({
                "actor": this.actor,
                "verb": {
                    "id": "http://adlnet.gov/expapi/verbs/progressed",
                    "display": { "en-US": "progressed" }
                },
                "object": {
                    "id": this.activityId,
                    "definition": {
                        "type": "http://adlnet.gov/expapi/activities/video"
                    }
                },
                "result": {
                    "completion": progress >= this.completionThreshold,
                    "extensions": {
                        "http://example.com/progress": progress
                    }
                }
            });
            this.lastPosition = progress;
        }
    }

    // Track chapter completion
    trackChapters() {
        const currentTime = this.video.currentTime;
        
        // Check each chapter
        document.querySelectorAll('.chapter-btn').forEach(btn => {
            const chapterTime = parseInt(btn.dataset.time);
            const chapterName = btn.textContent;
            
            // If we've watched past this chapter and haven't marked it as watched
            if (currentTime >= chapterTime && !this.chaptersWatched.has(chapterName)) {
                this.chaptersWatched.add(chapterName);
                
                // Send chapter completion statement
                this.sendStatement({
                    "actor": this.actor,
                    "verb": {
                        "id": "http://adlnet.gov/expapi/verbs/completed",
                        "display": { "en-US": "completed" }
                    },
                    "object": {
                        "id": `${this.activityId}/chapter/${chapterName}`,
                        "definition": {
                            "type": "http://adlnet.gov/expapi/activities/chapter",
                            "name": { "en-US": chapterName }
                        }
                    }
                });
            }
        });
    }

    // Send statement to LRS
    async sendStatement(statement) {
        try {
            const response = await fetch(this.lrsEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': 'Basic ' + btoa('username:password') // Replace with your LRS credentials
                    'Authorization': 'Basic ' + btoa('3801a2f11c4b43:edfd5cb3323440') // Replace with your LRS credentials
                },
                body: JSON.stringify(statement)
            });

            if (!response.ok) {
                throw new Error('Failed to send statement to LRS');
            }
        } catch (error) {
            console.error('Error sending statement to LRS:', error);
        }
    }
} 