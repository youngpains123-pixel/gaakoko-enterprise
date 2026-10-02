document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-links a");
  const orderForm = document.getElementById("orderForm");
  const formMessage = document.getElementById("formMessage");
  const scrollTopBtn = document.querySelector(".scroll-top");
  const yearEl = document.getElementById("year");
  const faqItems = document.querySelectorAll(".faq-item");
  const revealItems = document.querySelectorAll(".reveal");

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const sections = document.querySelectorAll("main section[id]");
  const setActiveLink = () => {
    const scrollPosition = window.scrollY + 120;

    sections.forEach((section) => {
      const id = section.getAttribute("id");
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);

      if (!link) return;

      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;

      if (scrollPosition >= top && scrollPosition < bottom) {
        navLinks.forEach((item) => item.classList.remove("active"));
        link.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", setActiveLink);
  setActiveLink();

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    if (!question) return;

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");

      faqItems.forEach((faq) => {
        faq.classList.remove("active");
        const btn = faq.querySelector(".faq-question");
        if (btn) btn.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("active");
        question.setAttribute("aria-expanded", "true");
      }
    });
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  if (scrollTopBtn) {
    const toggleScrollButton = () => {
      if (window.scrollY > 350) {
        scrollTopBtn.classList.add("visible");
      } else {
        scrollTopBtn.classList.remove("visible");
      }
    };

    window.addEventListener("scroll", toggleScrollButton);
    toggleScrollButton();

    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const productButtons = document.querySelectorAll(".mini-btn");
  productButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productName = button.getAttribute("data-product") || "Product";
      const serviceField = document.getElementById("serviceSelect");
      if (serviceField) {
        serviceField.value = productName;
      }
      document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
    });
  });

  if (orderForm) {
    orderForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("customerName").value.trim();
      const phone = document.getElementById("phoneNumber").value.trim();
      const email = document.getElementById("emailAddress").value.trim();
      const service = document.getElementById("serviceSelect").value.trim();
      const quantity = document.getElementById("quantity").value.trim();
      const completionDate = document.getElementById("completionDate").value.trim();
      const fileInput = document.getElementById("fileUpload");
      const fileName = fileInput && fileInput.files && fileInput.files.length ? fileInput.files[0].name : "No file selected";

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phonePattern = /^[0-9+()\s-]{7,}$/;

      if (!name || !phone || !email || !service || !quantity || !completionDate) {
        formMessage.textContent = "Please fill in all required fields.";
        formMessage.className = "form-message error";
        return;
      }

      if (!phonePattern.test(phone)) {
        formMessage.textContent = "Please enter a valid phone number.";
        formMessage.className = "form-message error";
        return;
      }

      if (!emailPattern.test(email)) {
        formMessage.textContent = "Please enter a valid email address.";
        formMessage.className = "form-message error";
        return;
      }

      if (Number(quantity) <= 0) {
        formMessage.textContent = "Quantity must be at least 1.";
        formMessage.className = "form-message error";
        return;
      }

      const successText = `Thank you, ${name}! Your order for ${service} has been received. We will contact you shortly. Selected file: ${fileName}.`;
      formMessage.textContent = successText;
      formMessage.className = "form-message success";
      orderForm.reset();
    });
  }
});