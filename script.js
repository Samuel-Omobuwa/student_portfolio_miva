
const pageName = document.body.dataset.page;
const navLinks = document.querySelectorAll('.nav-links a');
navLinks.forEach((link) => {
  const href = link.getAttribute('href') || '';
  if (pageName && href && href.includes(pageName + '.html')) {
    link.classList.add('active');
  }
});

const menuToggle = document.querySelector('.nav-toggle');
const navLinksWrap = document.querySelector('.nav-links');
if (menuToggle && navLinksWrap) {
  menuToggle.addEventListener('click', () => {
    navLinksWrap.classList.toggle('open');
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
  });

  navLinksWrap.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinksWrap.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const body = document.body;
const themeToggle = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme === 'night') {
  body.classList.add('night-mode');
  if (themeToggle) themeToggle.textContent = '☀';
}
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('night-mode');
    const isNight = body.classList.contains('night-mode');
    localStorage.setItem('portfolio-theme', isNight ? 'night' : 'day');
    themeToggle.textContent = isNight ? '☀' : '☾';
    themeToggle.setAttribute('aria-label', isNight ? 'Switch to light mode' : 'Switch to night mode');
  });
}

const currentYear = document.getElementById('year');
if (currentYear) currentYear.textContent = new Date().getFullYear();

const contactForm = document.querySelector('#contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = (formData.get('name') || '').toString().trim();
    const email = (formData.get('email') || '').toString().trim();
    const message = (formData.get('message') || '').toString().trim();
    const status = document.querySelector('#formStatus');

    if (!name || !email || !message) {
      status.textContent = 'Please complete all required fields before sending your message.';
      status.style.color = '#b42318';
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      status.textContent = 'Please enter a valid email address.';
      status.style.color = '#b42318';
      return;
    }

    const subject = (formData.get('subject') || 'Professional enquiry').toString().trim();
    const body = `Hello Samuel,\n\n${message}\n\nRegards,\n${name}\n${email}`;
    const mailto = `mailto:samuelomobuwa1@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.textContent = 'Opening your email app with Samuel’s address and your message filled in.';
    status.style.color = '#d4a73d';
    window.location.href = mailto;
  });
}

const whatsappMessage = document.querySelector('#whatsappMessage');
const whatsappLink = document.querySelector('#whatsappLink');
if (whatsappMessage && whatsappLink) {
  const updateWhatsAppLink = () => {
    const url = new URL('https://wa.me/message/EH5WRUIN3DQ4H1');
    const message = whatsappMessage.value.trim();
    if (message) url.searchParams.set('text', message);
    whatsappLink.href = url.toString();
  };

  whatsappMessage.addEventListener('input', updateWhatsAppLink);
  updateWhatsAppLink();
}

const plannerForm = document.querySelector('#plannerForm');
if (plannerForm) {
  const storageKey = 'data-analyst-planner-tasks';
  const taskList = document.querySelector('#taskList');
  const defaultTasks = [
    { id: 1, title: 'Build customer complaint trend summary', due: '2026-11-18', type: 'Assignment', priority: 'High', done: false, notes: 'Summarize recurring issues across digital and branch channels.' },
    { id: 2, title: 'Prepare branch NPS dashboard review', due: '2026-11-21', type: 'Project', priority: 'Medium', done: true, notes: 'Review score trends and highlight action areas for management.' },
    { id: 3, title: 'Review weekend service quality metrics', due: '2026-11-24', type: 'Review', priority: 'Low', done: false, notes: 'Check dips in service turnaround and voice-of-customer themes.' }
  ];

  const getTasks = () => { try { const raw = localStorage.getItem(storageKey); return raw ? JSON.parse(raw) : defaultTasks; } catch { return defaultTasks; } };
  const saveTasks = (tasks) => localStorage.setItem(storageKey, JSON.stringify(tasks));

  const renderTasks = () => {
    const tasks = getTasks();
    if (!taskList) return;
    if (!tasks.length) {
      taskList.innerHTML = '<div class="empty-state">No tasks yet. Add a new insight or reporting item.</div>';
      return;
    }

    taskList.innerHTML = tasks.map((task) => `
      <article class="task-item ${task.done ? 'done' : ''}">
        <div class="task-head">
          <h3>${task.title}</h3>
          <span class="meta-badge priority-${task.priority.toLowerCase()}">${task.priority}</span>
        </div>
        <div class="task-meta">
          <span class="meta-badge type-${task.type.toLowerCase()}">${task.type}</span>
          <span class="meta-badge">Due ${task.due}</span>
        </div>
        <p>${task.notes}</p>
        <div class="task-actions">
          <button type="button" class="btn-small primary" data-action="toggle" data-id="${task.id}">${task.done ? 'Mark active' : 'Mark done'}</button>
          <button type="button" class="btn-small secondary" data-action="delete" data-id="${task.id}">Delete</button>
        </div>
      </article>
    `).join('');
  };

  plannerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(plannerForm);
    const title = (formData.get('title') || '').toString().trim();
    const due = (formData.get('due') || '').toString();
    const type = (formData.get('type') || 'Assignment').toString();
    const priority = (formData.get('priority') || 'Medium').toString();
    const notes = (formData.get('notes') || '').toString().trim() || 'No additional notes yet.';

    if (!title || !due) return;

    const tasks = getTasks();
    tasks.push({ id: Date.now(), title, due, type, priority, done: false, notes });
    saveTasks(tasks);
    renderTasks();
    plannerForm.reset();
  });

  taskList.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    const action = button.dataset.action;
    const id = Number(button.dataset.id);
    const tasks = getTasks();

    if (action === 'toggle') {
      const updated = tasks.map((task) => task.id === id ? { ...task, done: !task.done } : task);
      saveTasks(updated);
      renderTasks();
    }

    if (action === 'delete') {
      saveTasks(tasks.filter((task) => task.id !== id));
      renderTasks();
    }
  });

  renderTasks();
}
