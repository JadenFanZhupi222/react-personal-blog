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
      tech: 'Tech Enthusiast',
      game: 'Gamer',
    },
    enter: 'Step inside',
    techStack: {
      title: 'Tech Stack',
      items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    },
    projects: {
      title: 'Featured Projects',
      items: [
        {
          title: 'Personal Blog',
          description: 'A modern personal website built with Next.js, React, and MongoDB.',
        },
        {
          title: 'Date Picker',
          description:
            'A calendar component built in Salesforce using LWC (Lightning Web Component), based on native HTML, CSS, and JavaScript.',
        },
      ],
    },
    contact: {
      title: 'Get In Touch',
      description: 'Feel free to reach out for collaborations or just a friendly hello',
      platforms: ['GitHub', 'WeChat', 'Email'],
    },
  },
  home: {
    title: 'Home',
    welcome: 'Welcome to My Space',
    description: 'Full-stack developer. I build things on the web and write about them here.',
    enter: 'Step inside',
    role: {
      fullstack: 'Full-stack Developer',
      tech: 'Tech Enthusiast',
      game: 'Gamer',
    },
    features: {
      about: {
        title: 'About Me',
        description: 'Background, skills, and what I have been working on.',
        action: 'View Profile',
      },
      projects: {
        title: 'Projects',
        description: 'Explore my portfolio of work and side projects.',
        action: 'View Projects',
      },
      blog: {
        title: 'Blog',
        description: 'Technical articles, tutorials, and code snippets.',
        action: 'Read Posts',
      },
    },
    activity: {
      title: 'What I am up to',
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
    title: 'About Me',
    description: 'A bit more about me — what I work on, what I am learning, and how I got here.',
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
      title: 'Experience',
    },
  },
  projects: {
    title: 'Projects',
    description: 'Recent work and side projects.',
    highlights: 'Key Highlights',
  },
  blog: {
    title: 'Blog',
    description: 'Technical articles, tutorials, and code snippets to help you learn and grow.',
    readMore: 'Read More',
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
    title: 'Contact',
    github: 'GitHub',
    emails: 'Email',
    socials: 'Socials',
  },
  notFound: {
    title: '404',
    description: 'This page does not exist.',
    backHome: 'Back to Home',
  },
  achievements: {
    title: 'Achievement Progress',
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
    gameCard: {
      achievements: '{achieved}/{total} achievements',
    },
    pagination: {
      page: 'Page {current} of {total}',
      prev: 'Prev',
      next: 'Next',
      goTo: 'Go to',
    },
    clickToView: 'Click on a game card to view achievements',
    achieved: 'Achieved',
    noAchievements: 'No achievements yet.',
    ownedByPercent: 'Rarity: {percent}%',
  },
};

export default en;
