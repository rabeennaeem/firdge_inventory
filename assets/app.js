document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const header = document.querySelector('header');
    const siteTitle = document.querySelector('.site-title');
    const menuButton = document.querySelector('.menu-button');
    const headRight = document.querySelector('.head-right');
    const navLinks = document.querySelectorAll('.head-right a');
    const sections = document.querySelectorAll('section');
    const heroVideo = document.querySelector('.hero-video');

    // Sticky Header Scroll Effect
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        
        if (scrollPosition > 50) {
            header.classList.add('scrolled');
            siteTitle.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
            siteTitle.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    menuButton.addEventListener('click', () => {
        headRight.classList.toggle('active');
        menuButton.textContent = headRight.classList.contains('active') ? '✕' : '☰';
    });

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Update active link
            navLinks.forEach(item => item.classList.remove('active'));
            e.target.classList.add('active');
            
            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                headRight.classList.remove('active');
                menuButton.textContent = '☰';
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!headRight.contains(e.target) && !menuButton.contains(e.target)) {
            headRight.classList.remove('active');
            menuButton.textContent = '☰';
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Highlight active section while scrolling
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Video loaded check
    if (heroVideo) {
        heroVideo.addEventListener('loadeddata', function() {
            console.log('Hero video loaded successfully');
        });
        
        heroVideo.addEventListener('error', function() {
            console.error('Error loading hero video');
            // You could add fallback content here
        });
    }

    // Set initial active link based on URL hash
    function setInitialActiveLink() {
        const currentHash = window.location.hash;
        if (currentHash) {
            const activeLink = document.querySelector(`.head-right a[href="${currentHash}"]`);
            if (activeLink) {
                navLinks.forEach(item => item.classList.remove('active'));
                activeLink.classList.add('active');
            }
        } else {
            // Default to home link if no hash
            document.querySelector('.head-right a[href="#home"]').classList.add('active');
        }
    }

    setInitialActiveLink();
});
// Scroll animation trigger
const steps = document.querySelectorAll('.step');

function checkSteps() {
    steps.forEach(step => {
        const stepPosition = step.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (stepPosition < screenPosition) {
            step.classList.add('in-view');
        }
    });
}

window.addEventListener('load', checkSteps);
window.addEventListener('scroll', checkSteps);

