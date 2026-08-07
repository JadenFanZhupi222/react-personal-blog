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
      tech: '技术记录',
      game: '游戏',
    },
    enter: '进入网站',
    techStack: {
      title: '技术栈',
      items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    },
    projects: {
      title: '项目',
      items: [
        {
          title: 'AI 拍照亭桌面应用',
          description: '覆盖拍摄、AI 生成、支付、打印与离线运行的可配置桌面系统',
        },
        {
          title: 'Strata',
          description: '一款聚焦历史、Diff 与日常仓库操作的跨平台桌面 Git 客户端',
        },
        {
          title: '家庭食谱小程序',
          description: '支持家庭共享食谱、菜单规划、协作编辑与权限管理的微信小程序',
        },
      ],
    },
    contact: {
      title: '联系方式',
      description: 'GitHub / 邮箱',
      platforms: ['GitHub', '邮箱'],
      copied: '已复制',
    },
  },
  home: {
    title: '首页',
    welcome: '技术文章、项目与开发实践',
    description: '汇集软件开发中的项目成果、技术记录与问题复盘。',
    features: {
      about: {
        title: '关于',
        description: '个人经历、专业技能与技术方向',
        action: '查看详细信息',
      },
      projects: {
        title: '项目',
        description: '已完成项目及其设计与实现',
        action: '浏览项目',
      },
      blog: {
        title: '博客',
        description: '开发记录、技术分析与解决方案',
        action: '阅读文章',
      },
    },
    showcase: {
      title: '精选项目',
      previous: '上一个项目',
      next: '下一个项目',
      viewProject: '查看项目',
      latestWriting: '最新文章',
      viewAllWriting: '查看全部文章',
    },
    activity: {
      title: '开发与兴趣动态',
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
    description: '个人经历、专业技能与技术方向。',
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
      title: '工作经历',
    },
  },
  projects: {
    title: '项目',
    description: '已完成项目及其设计与实现。',
    highlights: '实现要点',
  },
  blog: {
    title: '技术文章',
    description: '开发记录、技术分析与解决方案。',
    readMore: '阅读全文',
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
    title: '联系方式',
    description: '技术交流、项目合作及其他事项，可通过以下方式联系。',
    github: 'GitHub',
    emails: '邮箱',
    socials: '社交平台',
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
