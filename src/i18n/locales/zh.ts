import { Translations } from '../types';

const zh: Translations = {
  common: {
    refresh: '刷新',
    error: {
      title: '出错了',
      message: '请重试',
      retry: '重试',
    },
    update: {
      title: '发现新版本',
      message: '刷新后生效',
      refresh: '刷新',
    },
  },
  welcome: {
    name: 'Shijie Fan | 范世杰',
    nickname: 'Zhupi222',
    role: {
      fullstack: '全栈开发',
      tech: '技术',
      game: '游戏',
    },
    enter: '进入',
    techStack: {
      title: '技术栈',
      items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    },
    projects: {
      title: '项目',
      items: [
        {
          title: '个人博客',
          description: 'Next.js / React / MongoDB',
        },
        {
          title: '日历组件',
          description: 'Salesforce LWC 日历组件',
        },
      ],
    },
    contact: {
      title: '联系',
      description: 'GitHub / 微信 / 邮箱',
      platforms: ['GitHub', '微信', '邮箱'],
    },
  },
  home: {
    title: '首页',
    welcome: '代码 / 文章 / 项目',
    description: '记录开发、项目和踩过的坑。',
    features: {
      about: {
        title: '关于',
        description: '经历、技能、近况',
        action: '经历和技能',
      },
      projects: {
        title: '项目',
        description: '做过什么，怎么做的',
        action: '做过什么',
      },
      blog: {
        title: '博客',
        description: '问题、解法、复盘',
        action: '问题和解法',
      },
    },
    activity: {
      title: '近况',
      leetcode: {
        title: 'LeetCode 统计',
        placeholder: '加载中...',
        totalSolved: '已解总数',
        easy: '简单',
        medium: '中等',
        hard: '困难',
        ranking: '排名',
        completion: '完成率',
        reputation: '声望',
      },
      steam: {
        title: 'Steam 成就',
        placeholder: '加载中...',
        viewAchievements: '查看成就',
        totalPlaytime: '游玩时长',
        recentGames: '最近游玩',
        online: '在线',
        offline: '离线',
      },
    },
  },
  about: {
    title: '关于',
    description: '经历 / 技能 / 近况',
    skills: {
      title: '技能',
      categories: {
        frontend: '前端',
        backend: '后端',
        devops: '运维',
        tools: '工具',
      },
    },
    experience: {
      title: '经验',
    },
  },
  projects: {
    title: '项目',
    description: '个人项目',
    highlights: '亮点',
  },
  blog: {
    title: '博客',
    description: '技术记录',
    readMore: '继续',
    prev: '上一篇',
    next: '下一篇',
    related: '相关',
    backToList: '全部文章',
    taggedWith: '标签',
    noPostsForTag: '暂无文章。',
    copy: '复制',
    copied: '已复制',
  },
  contact: {
    title: '联系',
    github: 'GitHub',
    emails: '邮箱',
    socials: '社交',
  },
  notFound: {
    title: '404',
    description: '页面不存在。',
    backHome: '回首页',
  },
  achievements: {
    title: '游戏成就',
    summary: {
      games: '个游戏',
      played: '累计游玩',
    },
    sort: {
      label: '排序',
      playtime: '游玩时长',
      name: '字母顺序',
    },
    searchPlaceholder: '搜索游戏',
    noResults: '无匹配游戏。',
    mostPlayed: '最常玩',
    stats: {
      totalGames: {
        title: '游戏',
        subtitle: '超过 {hours} 小时',
      },
      totalPlaytime: {
        title: '游玩时长',
        subtitle: '总计',
      },
      achievements: {
        title: '成就',
        subtitle: '完成度 {percentage}',
      },
    },
    pagination: {
      page: '第 {current} 页，共 {total} 页',
      prev: '上一页',
      next: '下一页',
      goTo: '跳转到',
    },
    achieved: '已达成',
    locked: '未解锁',
    noAchievements: '暂无成就',
    ownedByPercent: '稀有度 {percent}%',
  },
};

export default zh;
