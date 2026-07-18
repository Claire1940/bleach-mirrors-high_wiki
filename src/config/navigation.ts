import {
	BookOpen,
	Users,
	Swords,
	Scroll,
	Gamepad2,
	Gift,
	Clapperboard,
	type LucideIcon,
} from 'lucide-react'

export interface NavigationItem {
	key: string // 用于翻译键，如 'guide' -> t('nav.guide')
	path: string // URL 路径，如 '/guide'
	icon: LucideIcon // Lucide 图标组件
	isContentType: boolean // 是否对应 content/ 目录
}

// 导航配置：7 个内容分类（低价值社交分类已按需求删除）
export const NAVIGATION_CONFIG: NavigationItem[] = [
	{ key: 'guide', path: '/guide', icon: BookOpen, isContentType: true },
	{ key: 'characters', path: '/characters', icon: Users, isContentType: true },
	{ key: 'tybw', path: '/tybw', icon: Swords, isContentType: true },
	{ key: 'lore', path: '/lore', icon: Scroll, isContentType: true },
	{ key: 'games', path: '/games', icon: Gamepad2, isContentType: true },
	{ key: 'codes', path: '/codes', icon: Gift, isContentType: true },
	{ key: 'movies', path: '/movies', icon: Clapperboard, isContentType: true },
]

// 从配置派生内容类型列表（用于路由和内容加载）
export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map(
	(item) => item.path.slice(1),
) // 移除开头的 '/' -> []

export type ContentType = (typeof CONTENT_TYPES)[number]

// 辅助函数：验证内容类型
export function isValidContentType(type: string): type is ContentType {
	return CONTENT_TYPES.includes(type as ContentType)
}
