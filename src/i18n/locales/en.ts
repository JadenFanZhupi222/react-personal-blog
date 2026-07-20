import { Translations } from '../types';

const en: Translations = {
  common: {
    refresh: 'Refresh',
    error: {
      title: 'Oops! Something went wrong.',
      message: "But don't worry, you can try again!",
      retry: 'Retry',
    },
    update: {
      title: 'New Version Available',
      message: 'Please refresh the page to get the latest content',
      refresh: 'Refresh Now',
    },
  },
  welcome: {
    name: 'Shijie Fan | 范世杰',
    nickname: 'Zhupi222',
    role: {
      fullstack: 'Full-stack Developer',
      tech: 'Technical Writing',
      game: 'Games',
    },
    enter: 'Enter site',
    techStack: {
      title: 'Tech Stack',
      items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    },
    projects: {
      title: 'Featured Projects',
      items: [
        {
          title: 'Personal Blog',
          description: 'Built with Next.js, React, and MongoDB.',
        },
        {
          title: 'Date Picker',
          description:
            'A calendar component built in Salesforce using LWC (Lightning Web Component), based on native HTML, CSS, and JavaScript.',
        },
      ],
    },
    contact: {
      title: 'Contact',
      description: 'GitHub / WeChat / Email',
      platforms: ['GitHub', 'WeChat', 'Email'],
    },
  },
  home: {
    title: 'Home',
    welcome: 'Technical writing, projects, and development work',
    description: 'A collection of software projects, technical notes, and development reviews.',
    features: {
      about: {
        title: 'About',
        description: 'Professional experience, technical skills, and areas of focus.',
        action: 'View details',
      },
      projects: {
        title: 'Projects',
        description: 'Completed projects with notes on their design and implementation.',
        action: 'Browse projects',
      },
      blog: {
        title: 'Writing',
        description: 'Development notes, technical analysis, and practical solutions.',
        action: 'Read articles',
      },
    },
    activity: {
      title: 'Development and interests',
      leetcode: {
        title: 'LeetCode Stats',
        placeholder: 'Loading LeetCode stats...',
        totalSolved: 'Total Solved',
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard',
        ranking: 'Ranking',
        completion: 'Completion',
        reputation: 'Reputation',
      },
      steam: {
        title: 'Steam Achievements',
        placeholder: 'Loading Steam data...',
        viewAchievements: 'View Achievements',
        totalPlaytime: 'Total Playtime',
        recentGames: 'Recent Games',
        online: 'Online',
        offline: 'Offline',
      },
    },
  },
  about: {
    title: 'About',
    description: 'Professional experience, technical skills, and areas of focus.',
    skills: {
      title: 'Skills',
      categories: {
        frontend: 'Frontend',
        backend: 'Backend',
        devops: 'DevOps',
        tools: 'Tools',
      },
    },
    experience: {
      title: 'Professional experience',
    },
  },
  projects: {
    title: 'Projects',
    description: 'Completed projects with notes on their design and implementation.',
    highlights: 'Implementation notes',
  },
  blog: {
    title: 'Technical writing',
    description: 'Development notes, technical analysis, and practical solutions.',
    readMore: 'Read article',
    prev: 'Previous',
    next: 'Next',
    related: 'Related posts',
    backToList: 'All posts',
    taggedWith: 'Tagged',
    noPostsForTag: 'No posts found for this tag.',
    copy: 'Copy',
    copied: 'Copied',
  },
  contact: {
    title: 'Contact information',
    description:
      'For technical discussions, project collaboration, or other enquiries, use the contact details below.',
    github: 'GitHub',
    emails: 'Email',
    socials: 'Social platforms',
  },
  notFound: {
    title: '404',
    description: 'This page does not exist.',
    backHome: 'Back to Home',
  },
  achievements: {
    title: 'Achievement Progress',
    summary: {
      games: 'games',
      played: 'played',
    },
    sort: {
      label: 'Sort',
      playtime: 'Most played',
      name: 'A → Z',
    },
    searchPlaceholder: 'Search games...',
    noResults: 'No games match your search.',
    mostPlayed: 'Most played',
    stats: {
      totalGames: {
        title: 'Total Games',
        subtitle: 'with >= {hours}h playtime',
      },
      totalPlaytime: {
        title: 'Total Playtime',
        subtitle: 'across all games',
      },
      achievements: {
        title: 'Achievements',
        subtitle: '{percentage} completed',
      },
    },
    pagination: {
      page: 'Page {current} of {total}',
      prev: 'Prev',
      next: 'Next',
      goTo: 'Go to',
    },
    achieved: 'Achieved',
    locked: 'Locked',
    noAchievements: 'No achievements yet.',
    ownedByPercent: 'Rarity: {percent}%',
  },
};

export default en;
