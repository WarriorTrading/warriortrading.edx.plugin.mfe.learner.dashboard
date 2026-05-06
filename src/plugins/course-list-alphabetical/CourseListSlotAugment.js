import { useEffect, useLayoutEffect } from 'react';

const TITLE_SORT_KEY = 'title';

/** Default English i18n for CertificateBanner audit branch (`passingGrade`). */
const PASSING_GRADE_SNIPPET = 'Grade required to pass the course';

/**
 * Hide direct children of `.course-card-banners` that contain the passing-grade
 * copy (CertificateBanner). Prefer structural match over Paragon class names.
 */
function hidePassingGradeBanners(root = document) {
  const roots = root.querySelectorAll(
    '.course-card-banners, [data-testid="CourseCardBanners"]',
  );
  roots.forEach((bannerRoot) => {
    bannerRoot.querySelectorAll(':scope > *').forEach((child) => {
      if (child.textContent?.includes(PASSING_GRADE_SNIPPET)) {
        child.setAttribute('data-warrior-hidden-audit-grade', 'true');
        child.hidden = true;
        Object.assign(child.style, { display: 'none' });
      }
    });
    // Fallback: nested alerts (older / different markup)
    bannerRoot.querySelectorAll('[role="alert"], .alert, [class*="banner"]').forEach((el) => {
      if (el.textContent?.includes(PASSING_GRADE_SNIPPET)) {
        el.setAttribute('data-warrior-hidden-audit-grade', 'true');
        el.hidden = true;
        Object.assign(el.style, { display: 'none' });
      }
    });
  });
}

/**
 * DIRECT_PLUGIN on `org.openedx.frontend.learner_dashboard.course_list.v1`.
 * Receives `courseListData` from the slot’s `pluginProps` (same path as the
 * default CourseList). Applies Title (A–Z) and hides the audit passing-grade strip.
 */
export default function CourseListSlotAugment({ courseListData }) {
  const setSortBy = courseListData?.filterOptions?.setSortBy;

  useLayoutEffect(() => {
    if (typeof setSortBy === 'function') {
      setSortBy(TITLE_SORT_KEY);
    }
  }, [setSortBy, courseListData]);

  useEffect(() => {
    hidePassingGradeBanners();
    const observer = new MutationObserver(() => {
      hidePassingGradeBanners();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
