(function () {
  const PRODUCTION_API_BASE_URL = 'https://api.nexexam.com';
  const PRODUCTION_APP_BASE_URL = 'https://app.nexexam.com';
  const LOCAL_API_BASE_URL = 'http://localhost:3012';
  const LOCAL_APP_BASE_URL = 'http://localhost:5173';
  const FALLBACK_IMAGE_LABEL = 'NexExam';

  function isLocalHost(hostname) {
    return hostname === 'localhost' || hostname === '127.0.0.1';
  }

  function baseUrl(localUrl, productionUrl, overrideName) {
    if (window[overrideName]) {
      return String(window[overrideName]).replace(/\/$/, '');
    }

    return isLocalHost(window.location.hostname) ? localUrl : productionUrl;
  }

  const apiBaseUrl = baseUrl(
    LOCAL_API_BASE_URL,
    PRODUCTION_API_BASE_URL,
    'NEXEXAM_API_BASE_URL',
  );
  const appBaseUrl = baseUrl(
    LOCAL_APP_BASE_URL,
    PRODUCTION_APP_BASE_URL,
    'NEXEXAM_APP_BASE_URL',
  );

  function text(value, fallback) {
    if (typeof value !== 'string') {
      return fallback;
    }

    const trimmed = value.trim();
    return trimmed || fallback;
  }

  function courseImageUrl(course) {
    const thumbnail = Array.isArray(course.thumbnail)
      ? course.thumbnail[0]
      : null;

    return (
      thumbnail?.downloadUrl ||
      thumbnail?.publicUrl ||
      thumbnail?.signedUrl ||
      thumbnail?.url ||
      ''
    );
  }

  function lessonCount(course) {
    if (course.counts?.lessons != null) {
      return course.counts.lessons;
    }

    if (course._count?.lessons != null) {
      return course._count.lessons;
    }

    return Array.isArray(course.lessons) ? course.lessons.length : 0;
  }

  function durationLabel(course) {
    const seconds = Number(course.durationSeconds || 0);
    if (!seconds) {
      return text(course.categoryRef?.name || course.examType, 'Self-paced');
    }

    const minutes = Math.max(1, Math.round(seconds / 60));
    if (minutes < 60) {
      return `${minutes} min`;
    }

    const hours = Math.round((minutes / 60) * 10) / 10;
    return `${hours} hr`;
  }

  function priceLabel(course) {
    if (course.accessType === 'free') {
      return 'Free';
    }

    if (course.accessType === 'paid' && course.priceCents != null) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: course.currency || 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(course.priceCents / 100);
    }

    if (course.accessType === 'subscription') {
      return course.subscriptionPlanKey || 'Subscription';
    }

    return 'Request access';
  }

  function courseHref(course) {
    const slug = text(course.slug, course.id || '');
    return `${appBaseUrl}/course/${encodeURIComponent(slug)}`;
  }

  function createElement(tag, className, content) {
    const element = document.createElement(tag);
    if (className) {
      element.className = className;
    }

    if (content != null) {
      element.textContent = content;
    }

    return element;
  }

  function iconText(label, iconLoading) {
    const wrap = createElement('div', 'time-wrap');
    const inner = createElement('div', 'time-text-wrap');
    const icon = document.createElement('img');
    icon.src = 'images/Time-Circle_1.svg';
    icon.loading = iconLoading || 'lazy';
    icon.alt = '';
    icon.className = 'time-image';
    inner.appendChild(icon);
    inner.appendChild(createElement('div', 'time-text', label));
    wrap.appendChild(inner);
    return wrap;
  }

  function createButtonText() {
    const view = createElement('div', 'view-wrap');
    view.appendChild(
      createElement('div', 'courses-button-text', 'View Course'),
    );
    const arrow = document.createElement('img');
    arrow.src = 'images/Arrow---Right_1.svg';
    arrow.loading = 'lazy';
    arrow.alt = '';
    view.appendChild(arrow);
    return view;
  }

  function createCourseCard(course, target) {
    const itemClass = target.classList.contains('collection-hero-list')
      ? 'collection-item-2 w-dyn-item'
      : 'collection-item w-dyn-item';
    const item = createElement('div', itemClass);
    item.setAttribute('role', 'listitem');

    const card = createElement(
      'a',
      'course-grid w-inline-block nexexam-course-card',
    );
    card.href = courseHref(course);
    card.target = '_blank';
    card.rel = 'noopener';

    const inner = createElement('div', 'courses-inner-wrap');
    const top = createElement('div', 'courses-top-title');
    top.appendChild(
      createElement(
        'h2',
        'courses-title',
        text(course.title, 'NexExam Course'),
      ),
    );

    const timeGrid = createElement('div', 'time-grid');
    timeGrid.appendChild(iconText(durationLabel(course), 'eager'));
    timeGrid.appendChild(iconText(`${lessonCount(course)} Lessons`));
    top.appendChild(timeGrid);
    inner.appendChild(top);

    const imageUrl = courseImageUrl(course);
    if (imageUrl) {
      const image = document.createElement('img');
      image.src = imageUrl;
      image.loading = 'lazy';
      image.alt = text(course.title, 'NexExam course');
      image.className = 'courses-crad-image';
      inner.appendChild(image);
    } else {
      inner.appendChild(
        createElement(
          'div',
          'courses-crad-image nexexam-course-image-placeholder',
          FALLBACK_IMAGE_LABEL,
        ),
      );
    }

    const bottom = createElement('div', 'courses-bottom-wrap');
    bottom.appendChild(
      createElement(
        'p',
        'courses-details',
        text(
          course.subtitle || course.description,
          'Build exam readiness with guided lessons and practice.',
        ),
      ),
    );

    const priceWrap = createElement('div', 'courses-price-wrap');
    priceWrap.appendChild(
      createElement('h3', 'price-blog-text', priceLabel(course)),
    );
    priceWrap.appendChild(createButtonText());
    bottom.appendChild(priceWrap);
    inner.appendChild(bottom);
    card.appendChild(inner);
    item.appendChild(card);
    return item;
  }

  function status(message, state) {
    const element = createElement('div', 'nexexam-course-status', message);
    if (state) {
      element.dataset.state = state;
    }
    return element;
  }

  function renderTarget(target, catalog) {
    const emptyState = target.parentElement?.querySelector(
      ':scope > .w-dyn-empty',
    );
    if (emptyState) {
      emptyState.style.display = 'none';
    }

    const limit = Number(target.dataset.courseLimit || 24);
    const source =
      target.dataset.courseFeatured === 'true' && catalog.featured?.length
        ? catalog.featured
        : catalog.courses || [];
    const courses = source.slice(0, limit);
    target.replaceChildren();

    if (!courses.length) {
      target.appendChild(status('No courses available yet.'));
      return;
    }

    courses.forEach((course) => {
      target.appendChild(createCourseCard(course, target));
    });
  }

  async function loadCatalog(maxTake) {
    const url = new URL('/api/course', apiBaseUrl);
    url.searchParams.set('take', String(maxTake));
    const response = await fetch(url.toString(), {
      headers: { Accept: 'application/json' },
      credentials: 'omit',
    });

    if (!response.ok) {
      throw new Error(`Course catalog request failed with ${response.status}`);
    }

    return response.json();
  }

  async function hydrateCourses() {
    const targets = Array.from(
      document.querySelectorAll('[data-nexexam-course-grid]'),
    );

    if (!targets.length) {
      return;
    }

    targets.forEach((target) => {
      target.replaceChildren(status('Loading courses...'));
    });

    try {
      const maxTake = Math.max(
        ...targets.map((target) => Number(target.dataset.courseLimit || 24)),
      );
      const catalog = await loadCatalog(maxTake);
      targets.forEach((target) => renderTarget(target, catalog));
    } catch (error) {
      console.error(error);
      targets.forEach((target) => {
        target.replaceChildren(
          status('Courses are temporarily unavailable.', 'error'),
        );
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hydrateCourses);
  } else {
    hydrateCourses();
  }
})();
