// app.js
document.addEventListener('DOMContentLoaded', () => {
    // --- Sticky Header Logic ---
    const stickyBar = document.querySelector('.sticky');
    const masthead = document.querySelector('.mast');
    
    if (stickyBar && masthead) {
        const observer = new IntersectionObserver(
            ([e]) => {
                // If masthead is not intersecting (scrolled past), show sticky
                if (!e.isIntersecting) {
                    stickyBar.classList.add('visible');
                } else {
                    stickyBar.classList.remove('visible');
                }
            },
            { threshold: 0 }
        );
        observer.observe(masthead);
    }

    // --- Quiz Modal Logic ---
    const modal = document.getElementById('quiz-modal');
    const openBtns = document.querySelectorAll('.open-quiz-btn');
    const closeBtn = document.getElementById('close-modal');
    const backBtn = document.getElementById('back-step');
    const progressBar = document.getElementById('quiz-progress');
    const steps = document.querySelectorAll('.quiz-step');
    
    let currentStep = 1;
    const totalSteps = 5; // Steps 1-5 are interactive, 6 is loading

    function updateModal() {
        // Update Step Visibility
        steps.forEach(step => {
            if (parseInt(step.dataset.step) === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Update Progress Bar
        const progressPercentage = (currentStep / totalSteps) * 100;
        if(currentStep <= totalSteps) {
            progressBar.style.width = `${progressPercentage}%`;
        }

        // Toggle Back Button
        if (currentStep > 1 && currentStep <= totalSteps) {
            backBtn.style.display = 'block';
        } else {
            backBtn.style.display = 'none';
        }
        
        // Hide close/back on loading step
        if (currentStep > totalSteps) {
            closeBtn.style.display = 'none';
            backBtn.style.display = 'none';
            document.querySelector('.progress-bar-container').style.display = 'none';
        }
    }

    // Open Modal
    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    });

    // Close Modal
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        // Reset quiz optionally
        currentStep = 1;
        updateModal();
    });

    // Next Step Logic
    document.querySelectorAll('[data-next]').forEach(btn => {
        btn.addEventListener('click', function() {
            const nextStep = parseInt(this.dataset.next);
            if (nextStep) {
                currentStep = nextStep;
                updateModal();
            }
        });
    });

    // Back Step Logic
    backBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateModal();
        }
    });

    // Highlight selected options in checkboxes/radios
    const checkInputs = document.querySelectorAll('.quiz-checkbox input, .quiz-radio input');
    checkInputs.forEach(input => {
        input.addEventListener('change', function() {
            // For radio buttons, un-highlight siblings
            if(this.type === 'radio') {
                const name = this.name;
                document.querySelectorAll(`input[name="${name}"]`).forEach(radio => {
                    radio.parentElement.style.borderColor = 'var(--border-color)';
                    radio.parentElement.style.background = 'var(--bg-alt)';
                });
            }
            
            // Highlight current
            if (this.checked) {
                this.parentElement.style.borderColor = 'var(--primary)';
                if(this.type === 'radio') {
                    this.parentElement.style.background = '#f1f8f5';
                }
            } else {
                this.parentElement.style.borderColor = 'var(--border-color)';
                this.parentElement.style.background = 'var(--bg-alt)';
            }
        });
    });

    // Finish Quiz / Calculate Discount
    const finishBtn = document.getElementById('finish-quiz');
    if(finishBtn) {
        finishBtn.addEventListener('click', () => {
            currentStep = 6; // Loading step
            updateModal();

            // Simulate loading and redirect
            setTimeout(() => {
                document.getElementById('loading-text').innerText = 'Discount Applied!';
                document.getElementById('loading-subtext').innerText = 'Redirecting to secure checkout...';
                
                setTimeout(() => {
                    window.location.href = 'https://silarahealth.com/products/silara-health-black-garlic';
                }, 1000);
            }, 2500);
        });
    }

    // --- Reading Progress Counter Logic ---
    const readingProgressBar = document.getElementById('reading-progress-bar');
    const readingCounter = document.getElementById('reading-counter');
    
    if (readingProgressBar && readingCounter) {
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            
            if (scrollHeight > 0) {
                const scrolled = (scrollTop / scrollHeight) * 100;
                // Calculate percentage left to read
                const remaining = Math.max(0, Math.round(100 - scrolled));
                
                readingProgressBar.style.width = scrolled + '%';
                readingCounter.innerText = remaining + '% left to read';
                
                // Only show counter if user has scrolled down a bit, hide when at very bottom
                if (scrolled > 2 && remaining > 0) {
                    readingCounter.classList.add('visible');
                } else {
                    readingCounter.classList.remove('visible');
                }
            }
        });
    }
});
