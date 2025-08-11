// JavaScript for the Choice Ice Cream website.
window.addEventListener('DOMContentLoaded', () => {

    const header = document.querySelector('.header-area');
    const menuTrigger = document.querySelector('.menu-trigger');
    const mainNav = document.querySelector('.main-nav .nav');

    // 1. Sticky Header on Scroll
    const handleStickyHeader = () => {
        if (window.scrollY > 50) {
            header.classList.add('header-sticky');
        } else {
            header.classList.remove('header-sticky');
        }
    };

    // Run the check once on page load
    handleStickyHeader();

    // Run the check again every time the user scrolls
    window.addEventListener('scroll', handleStickyHeader);


    // 2. Mobile Menu Toggle
    menuTrigger.addEventListener('click', () => {
        menuTrigger.classList.toggle('active');
        header.classList.toggle('open'); // Use .open to show/hide nav
    });


    // 3. Active Link highlighting on scroll
const sections = document.querySelectorAll('section, footer'); // FIX: Added footer to the selector
const navLinks = document.querySelectorAll('.nav a');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3 // FIX: Lowered threshold to 30% for better detection
};

const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('id');
            
            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));

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
    const bgImages = gsap.utils.toArray(".about-background-images img");
    const panelsContainer = document.querySelector(".panels-container");

    if (panels.length && panelsContainer) {
        // Main timeline for the scroll trigger
        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#about",
                pin: true,
                scrub: 1,
                snap: 1 / (panels.length - 1),
                end: () => "+=" + panelsContainer.offsetWidth
            }
        });

        // Add the panel scrolling animation to the timeline
        tl.to(panels, {
            xPercent: -100 * (panels.length - 1),
            ease: "none"
        });

        // Add the background image animations to the same timeline
        // They will move in sync with the horizontal scroll
        bgImages.forEach(img => {
            const speed = img.dataset.speed || 1;
            tl.to(img, {
                x: -200 * speed, // Move them horizontally
                ease: "none"
            }, 0); // The '0' at the end makes it start at the beginning of the timeline
        });
    }


        // 6. Products Section Animations
        const productSlides = gsap.utils.toArray(".product-slide");

        if (productSlides.length) {
            // This part remains the same
            if (productSlides[0].dataset.color) {
                document.body.style.backgroundColor = productSlides[0].dataset.color;
            }

            productSlides.forEach(slide => {
                ScrollTrigger.create({
                    trigger: slide,
                    start: 'top 50%',
                    end: 'bottom 50%',
                    onEnter: () => gsap.to('body', { backgroundColor: slide.dataset.color, duration: 0.4 }),
                    onEnterBack: () => gsap.to('body', { backgroundColor: slide.dataset.color, duration: 0.4 }),
                });

                // --- Animation Timeline for slide elements (UPDATED) ---
                let tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: slide,
                        start: 'top 80%',
                        end: 'bottom top',
                        scrub: true
                    }
                });

                // UPDATED: Select the new classes
                const name = slide.querySelector('.product-name');
                const image = slide.querySelector('.product-image img');
                const description = slide.querySelector('.product-description');

                // UPDATED: Set initial positions for new classes
                gsap.set(name, { xPercent: -100, opacity: 0 });
                gsap.set(image, { yPercent: 100, scale: 0.5, opacity: 0 });
                gsap.set(description, { xPercent: 100, opacity: 0 });

                // UPDATED: Animate new elements INTO view
                tl.to(name, { xPercent: 0, opacity: 1 }, 0)
                .to(image, { yPercent: 0, scale: 1, opacity: 1 }, 0)
                .to(description, { xPercent: 0, opacity: 1 }, 0);
                
                // UPDATED: Animate new elements OUT of view
                tl.to(name, { xPercent: 100, opacity: 0 }, 0.6)
                .to(image, { yPercent: -100, scale: 0.5, opacity: 0 }, 0.6)
                .to(description, { xPercent: -100, opacity: 0 }, 0.6);
            });
        }




    // 7. Footer Form Submission to Google Sheets
    const distributorForm = document.getElementById('distributor-form');
    const formStatus = distributorForm.querySelector('.form-status');

    distributorForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Stop the form from submitting the default way

        // IMPORTANT: Replace this with YOUR form's action URL
        const formActionURL = 'https://docs.google.com/forms/d/e/1FAIpQLSey1-tk-r6R79iRP-QRepE9fOLSRqHuwjML8Rrd1iGM8ZI-lw/formResponse';        
        const formData = new FormData(distributorForm);

        formStatus.textContent = 'Sending...';

        fetch(formActionURL, {
            method: 'POST',
            body: formData,
            mode: 'no-cors' // Important for this method
        })
        .then(response => {
            formStatus.textContent = 'Thank you! We will be in touch.';
            formStatus.style.color = 'green';
            distributorForm.reset(); // Clear the form
        })
        .catch(error => {
            formStatus.textContent = 'Oops! Something went wrong.';
            formStatus.style.color = 'red';
        });
    });




    // 8: Smooth Scrolling on Nav Link Click
    gsap.registerPlugin(ScrollToPlugin);

    // Select ALL links that should scroll smoothly (nav links AND the hero button)
    const scrollLinks = document.querySelectorAll('.nav a, .hero-buttons a[href^="#"]');

    scrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Stop the browser's default jump
            const targetId = link.getAttribute("href");

            // Use GSAP to smoothly scroll to the section
            gsap.to(window, {
                duration: 1.5, // How long the scroll takes
                scrollTo: targetId,
                ease: "power2.inOut"
            });

            // Also close the mobile menu if it's open
            if (header.classList.contains('open')) {
                menuTrigger.classList.remove('active');
                header.classList.remove('open');
            }
        });
    });


    // 9: Close Mobile Menu on Outside Click
    window.addEventListener('click', (e) => {
        // Check if the menu is open AND if the click was not on the menu itself or the hamburger icon
        if (header.classList.contains('open') && !mainNav.contains(e.target) && !menuTrigger.contains(e.target)) {
            // If the conditions are met, close the menu
            header.classList.remove('open');
            menuTrigger.classList.remove('active');
        }
    });

});