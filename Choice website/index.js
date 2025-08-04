// JavaScript for the Choice Ice Cream website.
window.addEventListener('DOMContentLoaded', () => {

    const header = document.querySelector('.header-area');
    const menuTrigger = document.querySelector('.menu-trigger');
    const mainNav = document.querySelector('.main-nav .nav');

    // 1. Sticky Header on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header-sticky');
        } else {
            header.classList.remove('header-sticky');
        }
    });

    // 2. Mobile Menu Toggle
    menuTrigger.addEventListener('click', () => {
        menuTrigger.classList.toggle('active');
        header.classList.toggle('open'); // Use .open to show/hide nav
    });

    // 3. Active Link highlighting on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav a');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.6 // 60% of the section must be visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Get the ID of the current section
                const sectionId = entry.target.getAttribute('id');
                
                // Add active class to the corresponding nav link
                const activeLink = document.querySelector(`.nav a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });




    // 4. Hero Image Parallax Effect
    const homeSection = document.getElementById('home');
    const heroImage = document.querySelector('.hero-image');
    
    if (homeSection && heroImage) {
        const parallaxStrength = 25;

        homeSection.addEventListener('mousemove', (e) => {
            // Calculate mouse position from center of the screen
            const x = (e.clientX / window.innerWidth - 0.5);
            const y = (e.clientY / window.innerHeight - 0.5);

            // Apply transform to the image in the opposite direction
            const transformX = -x * parallaxStrength;
            const transformY = -y * parallaxStrength;
            
            heroImage.style.transform = `translate(${transformX}px, ${transformY}px)`;
        });
    }


// 5. About Section Horizontal Scroll
    gsap.registerPlugin(ScrollTrigger);

    const panels = gsap.utils.toArray(".panel");
    if (panels.length) {
        gsap.to(panels, {
            xPercent: -100 * (panels.length - 1),
            ease: "none",
            scrollTrigger: {
                trigger: "#about",
                pin: true,
                scrub: 1,
                snap: 1 / (panels.length - 1),
                // base vertical scrolling on how wide the container is so it feels responsive
                end: () => "+=" + document.querySelector(".panels-container").offsetWidth
            }
        });
    }





    
});