import { Translations } from '../types';

const zh: Translations = {
  common: {
    refresh: '刷新',
    error: {
      title: '哎呀！出错了。',
      message: '别担心，你可以再试一次！',
      retry: '重试',
    },
    update: {
      title: '发现新版本',
      message: '请刷新页面以获取最新内容',
      refresh: '立即刷新',
    },
  },
  welcome: {
    name: 'Shijie Fan | 范世杰',
    nickname: 'Zhupi222',
    role: {
      fullstack: '全栈开发者',
      tech: '技术爱好者',
      game: '游戏玩家',
    },
    enter: '进来看看',
    techStack: {
      title: '技术栈',
      items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    },
    projects: {
      title: '精选项目',
      items: [
        {
          title: '个人博客主页',
          description: '一个现代化的个人网站，基于 Next.js、React 和 MongoDB 构建。',
        },
        {
          title: '日历组件',
          description:
            '在Salesforce中使用 LWC (Lightning Web Component)写的基于原生html、css、javascript的日历组件',
        },
      ],
    },
    contact: {
      title: '联系我',
      description: '无论是项目合作还是友好交流，都欢迎联系我',
      platforms: ['GitHub', '微信', '邮箱'],
    },
  },
  home: {
    title: '首页',
    welcome: '欢迎来到我的空间',
    description: '一个全栈开发者，在这里折腾代码、写点东西。',
    features: {
      about: {
        title: '关于我',
        description: '了解我的经历、技能和经验',
        action: '查看简介',
      },
      projects: {
        title: '项目',
        description: '探索我的作品集和个人项目',
        action: '查看项目',
      },
      blog: {
        title: '博客',
        description: '技术文章、教程和代码片段',
        action: '阅读文章',
      },
    },
    activity: {
      title: '最近在做的事',
      leetcode: {
        title: 'LeetCode 统计',
        placeholder: '正在加载 LeetCode 数据...',
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
        placeholder: '正在加载 Steam 数据...',
        viewAchievements: '查看成就',
        totalPlaytime: '总游戏时间',
        recentGames: '最近游戏',
        online: '在线',
        offline: '离线',
      },
    },
  },
  about: {
    title: '关于我',
    description: '关于我自己 —— 在做什么、在学什么、怎么走到这一步。',
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
    description: '最近做的项目和一些个人作品',
    highlights: '主要亮点',
  },
  blog: {
    title: '博客',
    description: '技术文章、经验和实用代码片段',
    readMore: '阅读更多',
    prev: '上一篇',
    next: '下一篇',
    related: '相关文章',
    backToList: '全部文章',
    taggedWith: '按标签筛选',
    noPostsForTag: '该标签下暂无文章。',
    copy: '复制',
    copied: '已复制',
  },
  contact: {
    title: '联系我',
    github: 'GitHub',
    emails: '邮箱',
    socials: '社交媒体',
  },
  notFound: {
    title: '404',
    description: '这个页面不存在。',
    backHome: '返回首页',
  },
  achievements: {
    title: '成就进度',
    stats: {
      totalGames: {
        title: '游戏总数',
        subtitle: '游玩时间超过 {hours} 小时',
      },
      totalPlaytime: {
        title: '总游戏时间',
        subtitle: '所有游戏的总游玩时间',
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
    noAchievements: '暂无成就',
    ownedByPercent: '稀有度：{percent}%',
  },
};

export default zh;
