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
        // Set initial background color from the first slide
        document.body.style.backgroundColor = productSlides[0].dataset.color;

        productSlides.forEach(slide => {
            // --- Background Color Changer ---
            ScrollTrigger.create({
                trigger: slide,
                start: 'top 50%',
                end: 'bottom 50%',
                onEnter: () => gsap.to('body', { backgroundColor: slide.dataset.color, duration: 1.0 }),
                onEnterBack: () => gsap.to('body', { backgroundColor: slide.dataset.color, duration: 1.0 }),
            });

            // --- Animation Timeline for slide elements ---
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: slide,
                    start: 'top 80%', // Start animation when slide is 80% from top
                    end: 'bottom top', // End when bottom of slide hits the top
                    scrub: true // Link animation progress to scroll
                }
            });

            const details = slide.querySelector('.product-details');
            const image = slide.querySelector('.product-image img');
            const flavors = slide.querySelector('.product-flavors');

            // Set initial off-screen positions
            gsap.set(details, { xPercent: -100, opacity: 0 });
            gsap.set(image, { yPercent: 100, scale: 0.5, opacity: 0 });
            gsap.set(flavors, { xPercent: 100, opacity: 0 });

            // Animate elements INTO view
            tl.to(details, { xPercent: 0, opacity: 1 }, 0)
              .to(image, { yPercent: 0, scale: 1, opacity: 1 }, 0)
              .to(flavors, { xPercent: 0, opacity: 1 }, 0);
              
            // Animate elements OUT of view
            tl.to(details, { xPercent: -100, opacity: 0 }, 0.6)
              .to(image, { yPercent: -100, scale: 0.5, opacity: 0 }, 0.6)
              .to(flavors, { xPercent: 100, opacity: 0 }, 0.6);
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




});