import { IconType } from 'react-icons/lib';
import { featureIcons } from './featureIcons';
import { PartialPermissions, Dictionary } from '@/features/auth/authStore';

export type AppMenuItem = {
  id: string;
  label: string;
  href: string;
  Icon: IconType;
  isExact?: boolean;
  createHref?: string;
  search?: Record<string, any>;
  children?: Array<AppMenuItem>;
};

export function menus(
  dictionary: Dictionary,
  hasPermission: (permissions: PartialPermissions) => boolean,
  options?: { isPlatformAdmin?: boolean; isCreator?: boolean },
) {
  const menus: Array<AppMenuItem> = [];

  if (options?.isPlatformAdmin) {
    menus.push({
      id: 'platformAdmin',
      label: dictionary.platformAdmin.menu,
      href: `/admin`,
      Icon: featureIcons.platformAdmin,
      isExact: true,
    });

    menus.push({
      id: 'platformCourses',
      label: dictionary.course.admin.menu,
      href: `/admin/courses`,
      Icon: featureIcons.course,
    });

    menus.push({
      id: 'platformCreatorApplications',
      label: dictionary.creatorApplication.adminTitle,
      href: `/admin/creator-applications`,
      Icon: featureIcons.creatorApplication,
    });

    menus.push({
      id: 'platformTrustSafety',
      label: dictionary.trustSafety.admin.menu,
      href: `/admin/trust-safety`,
      Icon: featureIcons.trustSafety,
    });

    return menus;
  }

  // Student dashboard items are hidden from teachers (users with a creator
  // application); they only ever see the creator experience.
  if (!options?.isCreator) {
    menus.push({
      id: 'studentDashboard',
      label: dictionary.dashboard.student.menu,
      href: `/student`,
      Icon: featureIcons.dashboard,
      isExact: true,
    });

    menus.push({
      id: 'studentMyCourses',
      label: dictionary.studentExperience.menu.myCourses,
      href: `/student/my-courses`,
      Icon: featureIcons.course,
      isExact: true,
    });

    if (
      hasPermission({
        course: ['read'],
      })
    ) {
      menus.push({
        id: 'course',
        label: dictionary.course.list.menu,
        href: `/course`,
        Icon: featureIcons.course,
      });
    }

    menus.push({
      id: 'studentPractice',
      label: dictionary.studentExperience.menu.practice,
      href: `/student/practice`,
      Icon: featureIcons.practiceQuestion,
      isExact: true,
    });

    menus.push({
      id: 'studentNotesStudyPlan',
      label: dictionary.studentExperience.menu.notesStudyPlan,
      href: `/student/notes`,
      Icon: featureIcons.studyNote,
      isExact: true,
    });

    menus.push({
      id: 'studentAiTutor',
      label: dictionary.studentExperience.menu.aiTutor,
      // Routes to the full-page AI Tutor. Previously this was an
      // `action: 'chatbot'` entry that opened the legacy ChatbotSheet — that
      // Sheet is no longer mounted, so clicks went nowhere.
      href: `/student/ai-tutor`,
      Icon: featureIcons.aiTutor,
    });
  }

  // The creator dashboard is only shown to teachers (users with a creator
  // application).
  if (options?.isCreator) {
    menus.push({
      id: 'creatorDashboard',
      label: dictionary.dashboard.creator.menu,
      href: `/creator`,
      Icon: featureIcons.creatorApplication,
      isExact: true,
    });
  }

  // The creator application form is the on-ramp for students to become
  // teachers, so it stays visible to everyone who can submit one.
  if (
    hasPermission({
      creatorApplication: ['create'],
    })
  ) {
    menus.push({
      id: 'creatorApplication',
      label: dictionary.creatorApplication.menu,
      href: `/creator-application`,
      Icon: featureIcons.creatorApplication,
    });
  }
  return menus;
}
