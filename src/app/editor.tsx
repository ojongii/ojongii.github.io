"use client";

import { useEffect, useRef, useState, type ComponentPropsWithoutRef, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { VscFolder, VscFolderOpened } from "react-icons/vsc";
import ReactMarkdown from "react-markdown";
import remarkDirective from "remark-directive";
import { visit } from "unist-util-visit";
import type { Root } from "mdast";
import type { ContainerDirective, LeafDirective, TextDirective } from "mdast-util-directive";

function remarkAdmonitions() {
	return (tree: Root) => {
		visit(tree, (node) => {
			if (node.type === "containerDirective" || node.type === "leafDirective" || node.type === "textDirective") {
				const directive = node as unknown as ContainerDirective | LeafDirective | TextDirective;
				directive.data = {
					...directive.data,
					hName: directive.name,
					hProperties: directive.attributes ?? {},
				};
			}
		});
	};
}

type FileNode = { type: "file"; id: string; name: string; content: string };
type FolderNode = { type: "folder"; id: string; name: string; children: TreeNode[] };
type TreeNode = FileNode | FolderNode;

type ThemeId = "nord" | "catppuccin" | "everforest" | "monokai";

type ThemeColors = {
	base: string;
	chrome: string;
	muted: string;
	selected: string;
	text: string;
	text2: string;
	accent: string;
	accentHover: string;
	yellow: string;
	green: string;
	orange: string;
	red: string;
};

const THEMES: Record<ThemeId, { label: string; colors: ThemeColors }> = {
	nord: {
		label: "Nord",
		colors: {
			base: "#1e222a",
			chrome: "#2e3440",
			muted: "#4c566a",
			selected: "#434c5e",
			text: "#eceff4",
			text2: "#d8dee9",
			accent: "#88c0d0",
			accentHover: "#8fbcbb",
			yellow: "#ebcb8b",
			green: "#a3be8c",
			orange: "#d08770",
			red: "#bf616a",
		},
	},
	catppuccin: {
		label: "Catppuccin Mocha",
		colors: {
			base: "#1e1e2e",
			chrome: "#181825",
			muted: "#6c7086",
			selected: "#45475a",
			text: "#cdd6f4",
			text2: "#bac2de",
			accent: "#89b4fa",
			accentHover: "#b4befe",
			yellow: "#f9e2af",
			green: "#a6e3a1",
			orange: "#fab387",
			red: "#f38ba8",
		},
	},
	everforest: {
		label: "Everforest",
		colors: {
			base: "#2d353b",
			chrome: "#343f44",
			muted: "#859289",
			selected: "#3a454a",
			text: "#d3c6aa",
			text2: "#9da9a0",
			accent: "#7fbbb3",
			accentHover: "#83c092",
			yellow: "#dbbc7f",
			green: "#a7c080",
			orange: "#e69875",
			red: "#e67e80",
		},
	},
	monokai: {
		label: "Monokai",
		colors: {
			base: "#272822",
			chrome: "#1e1f1c",
			muted: "#75715e",
			selected: "#49483e",
			text: "#f8f8f2",
			text2: "#cfcfc2",
			accent: "#66d9ef",
			accentHover: "#9fe7f5",
			yellow: "#e6db74",
			green: "#a6e22e",
			orange: "#fd971f",
			red: "#f92672",
		},
	},
};

const THEME_STORAGE_KEY = "editor-theme";

const portfolioTree: TreeNode[] = [
	{
		type: "file",
		id: "README.md",
		name: "README.md",
		content: `# 오종희\n\n### Frontend Developer\n\n:::banner\n성균관대학교에서 소프트웨어를 공부하며, SKKUDING에서 코드당 플랫폼을 개발하고 있습니다.\n:::\n\n화면 너머의 서비스 흐름을 이해하고, 파악한 문제를 명확하게 전달하며, 코드가 동작하는 원리를 궁금해하는 프론트엔드 개발자입니다. 눈에 보이는 화면 하나를 만들 때도 그 뒤에 있는 데이터와 사용자의 맥락까지 함께 고려하려 합니다.\n\n\`portfolio/\`에서 더 자세한 이야기를 볼 수 있고, \`blog/\`에서는 개발하며 남긴 기록을 볼 수 있습니다.\n`,
	},
	{
		type: "file",
		id: "introduction.md",
		name: "introduction.md",
		content: `# Introduction\n\n프론트엔드 개발에 국한되지 않고, 서비스 전체를 함께 만들어가는 개발자를 지향한다.\n\n- UI 개발뿐만 아니라 서비스 전체 흐름을 이해할 수 있다.\n  - 화면을 구현할 때도 해당 화면이 필요한 이유, 주고받는 데이터, 이후 이어지는 사용자 행동까지 함께 고려한다.\n- 파악한 문제점과 가능한 해결책을 정확하게 소통할 수 있다\n  - 발견한 문제는 혼자 해결하기보다, 팀원이 상황을 빠르게 파악하고 함께 판단할 수 있도록 명확하게 전달한다.\n- 코드의 원리를 이해하려 한다\n  - 단순히 동작하는 코드보다 동작 원리를 파악하는 데 집중하며, 이는 유사한 문제를 더 빠르게 해결하는 데 도움이 된다.\n`,
	},
	{
		type: "folder",
		id: "projects",
		name: "projects",
		children: [
			{
				type: "file",
				id: "projects/codedang.md",
				name: "codedang.md",
				content: `# CODEDANG (코드당)\n\n성균관대학교 학생들을 위한 온라인 저지(Online Judge) 플랫폼으로, 학생 개발팀 SKKUDING에서 만들고 운영하고 있습니다. 컴파일러 설치나 에디터 설정 같은 복잡한 과정 없이 브라우저에서 바로 코드를 작성, 실행, 채점할 수 있어 코딩을 처음 접하는 학생도 쉽게 문제 풀이를 시작할 수 있도록 돕는 것을 목표로 합니다.\n\n프론트엔드 개발자로 참여하여 문제 풀이, 채점 결과 확인, 대회 진행 등 핵심 사용자 흐름을 구현했습니다. 실제로 사용하는 학생들의 피드백을 받으며 기능을 다듬어가는 과정에서, 화면 너머의 사용자 흐름을 읽는 감각을 키울 수 있었습니다.\n`,
			},
			{
				type: "file",
				id: "projects/side-project.md",
				name: "side-project.md",
				content: `# 사이드 프로젝트\n\n모든 것은 처음에는 복잡해 보이지만, 결국 단순한 원리로 귀결된다. 이 프로젝트는 그러한 믿음에서 출발하여 여러 시행착오를 거치며 완성되었다.\n\n화면 구성부터 상호작용까지, 사용자가 자연스럽게 몰입할 수 있는 흐름을 고민했다. 작은 아이디어에서 시작해 기획부터 구현까지 직접 맡아보며, 혼자서도 하나의 서비스를 끝까지 완성해보는 경험을 쌓을 수 있었다.\n`,
			},
		],
	},
	{
		type: "file",
		id: "skills.md",
		name: "skills.md",
		content: `# Skills\n\n- React\n- Next.js\n- Tailwind CSS\n- Git\n- TypeScript\n`,
	},
	{
		type: "file",
		id: "experiences.md",
		name: "experiences.md",
		content: `# Experience\n\n## 코드당 플랫폼 개발 — SKKUDING\n성균관대학교 학생 개발팀 SKKUDING에서 프론트엔드 개발자로 활동하며, 온라인 저지 플랫폼 코드당의 문제 풀이 · 채점 · 대회 진행 흐름을 Next.js와 TypeScript 기반으로 개발했습니다. 실제 사용자인 학생들의 피드백을 반영하며 기능을 개선해나가고 있습니다.\n`,
	},
	{
		type: "file",
		id: "education.md",
		name: "education.md",
		content: `# Education\n\n## 성균관대학교 소프트웨어학과\n*2025.03 – 재학중*\n\n소프트웨어학과에서 전공 지식을 쌓으며, SKKUDING 활동을 통해 배운 것을 실제 서비스에 적용해보고 있습니다.\n`,
	},
	{
		type: "file",
		id: "contact.md",
		name: "contact.md",
		content: `# Contact\n\n::cta{label="GitHub" href="https://github.com/ojongii"}\n\n::cta{label="메일 보내기" href="mailto:loversduck123@naver.com"}\n`,
	},
];

const blogTree: TreeNode[] = [
	{
		type: "file",
		id: "hello-world.md",
		name: "hello-world.md",
		content: `# Hello World\n\n언론·출판은 타인의 명예나 권리 또는 공중도덕이나 사회윤리를 침해하여서는 아니된다. 언론·출판이 타인의 명예나 권리를 침해한 때에는 피해자는 이에 대한 피해의 배상을 청구할 수 있다.\n\n국회는 국무총리 또는 국무위원의 해임을 대통령에게 건의할 수 있다. 헌법개정은 국회재적의원 과반수 또는 대통령의 발의로 제안된다. 국가는 농업 및 어업을 보호·육성하기 위하여 농·어촌종합개발과 그 지원등 필요한 계획을 수립·시행하여야 한다.\n\n모든 국민은 건강하고 쾌적한 환경에서 생활할 권리를 가지며, 국가와 국민은 환경보전을 위하여 노력하여야 한다. 사회적 특수계급의 제도는 인정되지 아니하며, 어떠한 형태로도 이를 창설할 수 없다.\n\n헌법개정안이 제2항의 찬성을 얻은 때에는 헌법개정은 확정되며, 대통령은 즉시 이를 공포하여야 한다. 원장은 국회의 동의를 얻어 대통령이 임명하고, 그 임기는 4년으로 하며, 1차에 한하여 중임할 수 있다.\n\n정당은 그 목적·조직과 활동이 민주적이어야 하며, 국민의 정치적 의사형성에 참여하는데 필요한 조직을 가져야 한다. 근로자는 근로조건의 향상을 위하여 자주적인 단결권·단체교섭권 및 단체행동권을 가진다.\n`,
	},
];

const workspaces = [
	{ id: "portfolio" as const, label: "portfolio", tree: portfolioTree },
	{ id: "blog" as const, label: "blog", tree: blogTree },
];

type WorkspaceId = (typeof workspaces)[number]["id"];

function flattenFileIds(nodes: TreeNode[]): string[] {
	const ids: string[] = [];
	for (const n of nodes) {
		if (n.type === "file") ids.push(n.id);
		else ids.push(...flattenFileIds(n.children));
	}
	return ids;
}

function collectFolderIds(nodes: TreeNode[]): string[] {
	const ids: string[] = [];
	for (const n of nodes) {
		if (n.type === "folder") {
			ids.push(n.id);
			ids.push(...collectFolderIds(n.children));
		}
	}
	return ids;
}

const portfolioFileIds = flattenFileIds(portfolioTree);
const blogFileIds = flattenFileIds(blogTree);

const filesById = new Map<string, FileNode>();
(function index(nodes: TreeNode[]) {
	for (const n of nodes) {
		if (n.type === "file") filesById.set(n.id, n);
		else index(n.children);
	}
})([...portfolioTree, ...blogTree]);

function displayName(name: string) {
	return name.replace(/\.md$/, "");
}

function SidebarIcon() {
	return (
		<svg width={16} height={16} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.3}>
			<rect x={1.5} y={2.5} width={13} height={11} rx={1.5} />
			<line x1={6} y1={2.5} x2={6} y2={13.5} />
		</svg>
	);
}

function ChevronIcon({ open }: { open: boolean }) {
	return (
		<svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.5} className={`shrink-0 transition-transform ${open ? "rotate-90" : ""}`}>
			<path d="M4 2l4 4-4 4" />
		</svg>
	);
}

function FolderIcon({ open }: { open: boolean }) {
	return open ? <VscFolderOpened size={14} color="var(--c-yellow)" className="shrink-0" /> : <VscFolder size={14} color="var(--c-yellow)" className="shrink-0" />;
}

function FileIcon() {
	return (
		<svg width={14} height={14} viewBox="0 0 16 16" fill="none" stroke="var(--c-accent)" strokeWidth={1.2} className="shrink-0">
			<path d="M3.5 1.5h6l3 3v9.5a.5.5 0 0 1-.5.5h-8.5a.5.5 0 0 1-.5-.5v-12a.5.5 0 0 1 .5-.5z" />
			<path d="M9.5 1.5v3h3" />
		</svg>
	);
}

function CloseIcon() {
	return (
		<svg width={10} height={10} viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={1.4}>
			<path d="M1 1l8 8M9 1l-8 8" />
		</svg>
	);
}

function MinimizeIcon() {
	return (
		<svg width={10} height={10} viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={1.2}>
			<line x1={1} y1={5} x2={9} y2={5} />
		</svg>
	);
}

function MaximizeIcon() {
	return (
		<svg width={10} height={10} viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={1}>
			<rect x={2.5} y={1} width={6.5} height={6.5} />
			<path d="M1 3v5.5a.5.5 0 0 0 .5.5H7" />
		</svg>
	);
}

function CloseWindowIcon() {
	return (
		<svg width={10} height={10} viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={1.2}>
			<path d="M1 1l8 8M9 1l-8 8" />
		</svg>
	);
}

function ShiftWorkspaceIcon() {
	return (
		<svg width={18} height={18} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
			<path d="M2.5 5.5h9l-2.5-2.5" />
			<path d="M13.5 10.5h-9l2.5 2.5" />
		</svg>
	);
}

function GearIcon() {
	return (
		<svg width={16} height={16} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round">
			<circle cx={8} cy={8} r={2.3} />
			<path d="M8 1.5v1.8M8 12.7v1.8M14.5 8h-1.8M3.3 8H1.5M12.5 3.5l-1.27 1.27M4.77 11.23L3.5 12.5M12.5 12.5l-1.27-1.27M4.77 4.77L3.5 3.5" />
		</svg>
	);
}

function Banner({ children }: { children?: ReactNode }) {
	return <div className="mb-4 rounded-md border-l-4 border-[var(--c-accent)] bg-[var(--c-accent)]/10 px-4 py-3 text-sm [&_p]:mb-0 [&_p]:text-[var(--c-text)]">{children}</div>;
}

function Cta({ label, href }: { label?: string; href?: string }) {
	if (!label || !href) return null;
	return (
		<a
			href={href}
			target={href.startsWith("http") ? "_blank" : undefined}
			rel="noreferrer"
			className="mb-4 inline-flex items-center gap-2 rounded-md bg-[var(--c-accent)] px-4 py-2 text-sm font-semibold text-[var(--c-base)] transition-colors duration-150 hover:bg-[var(--c-accent-hover)]"
		>
			{label} <span aria-hidden>→</span>
		</a>
	);
}

function Card({ title, children }: { title?: string; children?: ReactNode }) {
	return (
		<div className="mb-4 rounded-lg border border-white/10 bg-white/[0.03] p-4 [&_p]:mb-0 [&_p]:text-[var(--c-text2)]">
			{title && <div className="mb-1 text-xs font-semibold tracking-wider text-[var(--c-muted)] uppercase">{title}</div>}
			{children}
		</div>
	);
}

const markdownComponents = {
	h1: (props: ComponentPropsWithoutRef<"h1">) => <h1 className="mb-4 text-2xl font-bold tracking-tight text-[var(--c-text)]" {...props} />,
	h2: (props: ComponentPropsWithoutRef<"h2">) => <h2 className="mb-2 mt-6 text-lg font-semibold text-[var(--c-text)]" {...props} />,
	h3: (props: ComponentPropsWithoutRef<"h3">) => <h3 className="mb-2 mt-4 text-base font-semibold text-[var(--c-text)]" {...props} />,
	p: (props: ComponentPropsWithoutRef<"p">) => <p className="mb-3 text-sm leading-6 text-[var(--c-text2)]" {...props} />,
	ul: (props: ComponentPropsWithoutRef<"ul">) => (
		<ul className="mb-3 ml-5 list-disc space-y-1 text-sm text-[var(--c-text2)] [&_ul]:mt-1 [&_ul]:mb-0 [&_ul]:space-y-1" {...props} />
	),
	ol: (props: ComponentPropsWithoutRef<"ol">) => <ol className="mb-3 ml-5 list-decimal space-y-1 text-sm text-[var(--c-text2)]" {...props} />,
	li: (props: ComponentPropsWithoutRef<"li">) => <li className="pl-1" {...props} />,
	strong: (props: ComponentPropsWithoutRef<"strong">) => <strong className="font-semibold text-[var(--c-text)]" {...props} />,
	em: (props: ComponentPropsWithoutRef<"em">) => <em className="text-[var(--c-muted)] italic" {...props} />,
	a: (props: ComponentPropsWithoutRef<"a">) => (
		<a className="text-[var(--c-accent)] underline decoration-[var(--c-accent)]/40 underline-offset-2 hover:decoration-[var(--c-accent)]" target="_blank" rel="noreferrer" {...props} />
	),
	code: (props: ComponentPropsWithoutRef<"code">) => <code className="rounded bg-white/5 px-1 py-0.5 font-mono text-[12px] text-[var(--c-yellow)]" {...props} />,
	hr: (props: ComponentPropsWithoutRef<"hr">) => <hr className="my-4 border-white/5" {...props} />,
	banner: Banner,
	cta: Cta,
	card: Card,
};

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

function JsonValue({ value }: { value: Json }) {
	if (value === null) return <span className="text-[var(--c-muted)]">null</span>;
	if (typeof value === "boolean") return <span className="text-[var(--c-yellow)]">{String(value)}</span>;
	if (typeof value === "number") return <span className="text-[var(--c-orange)]">{value}</span>;
	if (typeof value === "string") return <span className="text-[var(--c-green)]">&quot;{value}&quot;</span>;

	const entries = Array.isArray(value) ? value.map((v, i) => [String(i), v] as const) : Object.entries(value);
	const label = Array.isArray(value) ? `Array(${entries.length})` : `Object(${entries.length})`;

	return (
		<details open className="ml-1">
			<summary className="cursor-pointer select-none font-mono text-xs text-[var(--c-muted)]">{label}</summary>
			<div className="ml-3 border-l border-white/5 pl-3">
				{entries.map(([k, v]) => (
					<div key={k} className="py-0.5 text-sm">
						<span className="text-[var(--c-accent)]">{k}</span>
						<span className="text-[var(--c-muted)]">: </span>
						<JsonValue value={v} />
					</div>
				))}
			</div>
		</details>
	);
}

function JsonPreview({ source }: { source: string }) {
	let parsed: Json;
	try {
		parsed = JSON.parse(source);
	} catch (err) {
		return <div className="text-sm text-[var(--c-red)]">Invalid JSON — {err instanceof Error ? err.message : "could not parse"}</div>;
	}
	return <JsonValue value={parsed} />;
}

function FileContent({ file }: { file: FileNode }) {
	if (file.name.endsWith(".md")) {
		return (
			<ReactMarkdown remarkPlugins={[remarkDirective, remarkAdmonitions]} components={markdownComponents}>
				{file.content}
			</ReactMarkdown>
		);
	}
	if (file.name.endsWith(".json")) {
		return <JsonPreview source={file.content} />;
	}
	return <pre className="whitespace-pre-wrap font-mono text-[13px] leading-6 text-[var(--c-text)]">{file.content}</pre>;
}

function Tree({
	nodes,
	depth,
	expanded,
	onToggleFolder,
	activeId,
	onOpenFile,
}: {
	nodes: TreeNode[];
	depth: number;
	expanded: Record<string, boolean>;
	onToggleFolder: (id: string) => void;
	activeId: string | null;
	onOpenFile: (id: string) => void;
}) {
	return (
		<div>
			{nodes.map((n) =>
				n.type === "folder" ? (
					<div key={n.id}>
						<button
							onClick={() => onToggleFolder(n.id)}
							style={{ paddingLeft: 8 + depth * 14 }}
							className="flex w-full items-center gap-1.5 rounded-md py-1 pr-2 text-left text-[var(--c-text)] transition-colors duration-150 hover:bg-white/5"
						>
							<ChevronIcon open={!!expanded[n.id]} />
							<FolderIcon open={!!expanded[n.id]} />
							<span className="truncate">{n.name}</span>
						</button>
						{expanded[n.id] && (
							<Tree nodes={n.children} depth={depth + 1} expanded={expanded} onToggleFolder={onToggleFolder} activeId={activeId} onOpenFile={onOpenFile} />
						)}
					</div>
				) : (
					<button
						key={n.id}
						onClick={() => onOpenFile(n.id)}
						style={{ paddingLeft: 8 + depth * 14 + 16 }}
						className={`flex w-full items-center gap-1.5 rounded-md py-1 pr-2 text-left transition-colors duration-150 ${activeId === n.id ? "bg-[var(--c-selected)] text-[var(--c-text)]" : "text-[var(--c-text)] hover:bg-white/5"}`}
					>
						<FileIcon />
						<span className="truncate">{displayName(n.name)}</span>
					</button>
				),
			)}
		</div>
	);
}

export default function Editor() {
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [workspaceId, setWorkspaceId] = useState<WorkspaceId>("portfolio");
	const [themeId, setThemeId] = useState<ThemeId>("nord");
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
		Object.fromEntries(collectFolderIds([...portfolioTree, ...blogTree]).map((id) => [id, true])),
	);
	const [openTabs, setOpenTabs] = useState<string[]>(portfolioFileIds);
	const [activeId, setActiveId] = useState<string | null>("README.md");

	const activeWorkspace = workspaces.find((w) => w.id === workspaceId)!;
	const isBlog = workspaceId === "blog";
	const theme = THEMES[themeId].colors;

	useEffect(() => {
		const stored = localStorage.getItem(THEME_STORAGE_KEY);
		if (stored && stored in THEMES) setThemeId(stored as ThemeId);
	}, []);

	useEffect(() => {
		localStorage.setItem(THEME_STORAGE_KEY, themeId);
	}, [themeId]);

	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());
	const pendingScrollRef = useRef<string | null>(null);
	const rafRef = useRef<number | null>(null);
	const programmaticScrollRef = useRef(false);
	const programmaticScrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		const id = pendingScrollRef.current;
		if (!id) return;
		const el = sectionRefs.current.get(id);
		if (el) {
			scrollToEl(el);
			pendingScrollRef.current = null;
		}
	}, [openTabs]);

	useEffect(() => {
		return () => {
			if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
			if (programmaticScrollTimeoutRef.current !== null) clearTimeout(programmaticScrollTimeoutRef.current);
		};
	}, []);

	// Smooth-scrolling takes a few hundred ms, during which the scroll-spy would
	// otherwise see every section it passes through and flicker the active tab.
	// Suppress the spy for the duration of any scroll we triggered ourselves.
	function scrollToEl(el: HTMLElement) {
		programmaticScrollRef.current = true;
		if (programmaticScrollTimeoutRef.current !== null) clearTimeout(programmaticScrollTimeoutRef.current);
		programmaticScrollTimeoutRef.current = setTimeout(() => {
			programmaticScrollRef.current = false;
		}, 700);
		el.scrollIntoView({ behavior: "smooth", block: "start" });
	}

	function scrollToFile(id: string) {
		const el = sectionRefs.current.get(id);
		if (el) scrollToEl(el);
	}

	function openFile(id: string) {
		if (isBlog) {
			setOpenTabs((tabs) => (tabs.includes(id) ? tabs : [...tabs, id]));
			setActiveId(id);
			return;
		}
		const willAdd = !openTabs.includes(id);
		setOpenTabs((tabs) => (tabs.includes(id) ? tabs : [...tabs, id]));
		setActiveId(id);
		if (willAdd) {
			pendingScrollRef.current = id;
		} else {
			scrollToFile(id);
		}
	}

	function focusTab(id: string) {
		setActiveId(id);
		if (!isBlog) scrollToFile(id);
	}

	function closeTab(id: string, e?: MouseEvent) {
		e?.stopPropagation();
		const idx = openTabs.indexOf(id);
		const next = openTabs.filter((t) => t !== id);
		setOpenTabs(next);
		if (activeId === id) {
			setActiveId(next[idx] ?? next[idx - 1] ?? null);
		}
	}

	function toggleFolder(id: string) {
		setExpanded((e) => ({ ...e, [id]: !e[id] }));
	}

	function shiftWorkspace() {
		const next = isBlog ? "portfolio" : "blog";
		setWorkspaceId(next);
		if (next === "portfolio") {
			setOpenTabs(portfolioFileIds);
			setActiveId("README.md");
		} else {
			const first = blogFileIds[0] ?? null;
			setOpenTabs(first ? [first] : []);
			setActiveId(first);
		}
	}

	function handleContentScroll() {
		if (programmaticScrollRef.current) return;
		if (rafRef.current !== null) return;
		rafRef.current = requestAnimationFrame(() => {
			rafRef.current = null;
			if (programmaticScrollRef.current) return;
			const container = scrollContainerRef.current;
			if (!container) return;

			// A short last section can never cross the threshold below, so once
			// scrolled to the bottom, force-select the last open file directly.
			const atBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 2;
			if (atBottom) {
				const last = openTabs[openTabs.length - 1];
				if (last && last !== activeId) setActiveId(last);
				return;
			}

			const containerTop = container.getBoundingClientRect().top;
			let current: string | null = null;
			for (const id of openTabs) {
				const el = sectionRefs.current.get(id);
				if (!el) continue;
				const top = el.getBoundingClientRect().top - containerTop;
				if (top <= 96) {
					current = id;
				} else {
					break;
				}
			}
			if (current && current !== activeId) {
				setActiveId(current);
			}
		});
	}

	const activeFile = activeId ? filesById.get(activeId) : undefined;
	const wordCount = activeFile ? activeFile.content.trim().split(/\s+/).filter(Boolean).length : 0;
	const charCount = activeFile ? activeFile.content.length : 0;

	const themeStyle = {
		"--c-base": theme.base,
		"--c-chrome": theme.chrome,
		"--c-muted": theme.muted,
		"--c-selected": theme.selected,
		"--c-text": theme.text,
		"--c-text2": theme.text2,
		"--c-accent": theme.accent,
		"--c-accent-hover": theme.accentHover,
		"--c-yellow": theme.yellow,
		"--c-green": theme.green,
		"--c-orange": theme.orange,
		"--c-red": theme.red,
	} as CSSProperties;

	return (
		<div className="flex h-screen w-screen flex-col overflow-hidden bg-[var(--c-base)] text-sm text-[var(--c-text)]" style={themeStyle}>
			<div className="flex h-10 shrink-0 items-stretch bg-[var(--c-chrome)] font-[family-name:var(--font-jetbrains-mono)] shadow-sm shadow-black/20">
				<div
					className={`flex shrink-0 items-center gap-3 overflow-hidden px-2 transition-[width] duration-150 ${sidebarOpen ? "w-60" : "w-12"}`}
				>
					<button
						onClick={() => setSidebarOpen((v) => !v)}
						aria-label="사이드바 토글"
						className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors duration-150 hover:bg-white/10"
					>
						<SidebarIcon />
					</button>
				</div>

				<div className="flex min-w-0 flex-1 items-stretch gap-1 overflow-hidden px-2 pt-1.5">
					{openTabs.map((id) => {
						const file = filesById.get(id);
						if (!file) return null;
						const isActive = id === activeId;
						return (
							<button
								key={id}
								onClick={() => focusTab(id)}
								className={`group tab-shape relative flex min-w-[64px] max-w-[200px] flex-1 items-center gap-2 rounded-t-lg border-t-2 px-3 text-xs transition-colors duration-150 ${
									isActive ? "tab-notch border-t-[var(--c-accent)] bg-[var(--c-base)] text-[var(--c-text)]" : "border-t-transparent text-[var(--c-muted)] hover:text-[var(--c-text)]"
								}`}
							>
								{!isActive && (
									<span className="pointer-events-none absolute inset-x-0 top-0 bottom-1 -z-10 rounded-lg opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-hover:bg-white/5" />
								)}
								<FileIcon />
								<span className="min-w-0 flex-1 truncate text-left">{displayName(file.name)}</span>
								<span
									onClick={isBlog ? (e) => closeTab(id, e) : undefined}
									className={`ml-1 h-4 w-4 shrink-0 items-center justify-center rounded hover:bg-white/20 ${
										isActive ? "flex" : "hidden group-hover:flex"
									}`}
								>
									<CloseIcon />
								</span>
							</button>
						);
					})}
				</div>

				<div className="flex shrink-0 items-stretch">
					<button
						onClick={() => document.exitFullscreen?.().catch(() => {})}
						aria-label="전체화면 종료"
						className="flex w-11 items-center justify-center text-[var(--c-text2)] transition-colors duration-150 hover:bg-white/10"
					>
						<MinimizeIcon />
					</button>
					<button
						onClick={() => document.documentElement.requestFullscreen?.().catch(() => {})}
						aria-label="전체화면"
						className="flex w-11 items-center justify-center text-[var(--c-text2)] transition-colors duration-150 hover:bg-white/10"
					>
						<MaximizeIcon />
					</button>
					<button
						tabIndex={-1}
						aria-hidden="true"
						className="flex w-11 items-center justify-center text-[var(--c-text2)] transition-colors duration-150 hover:bg-[var(--c-red)] hover:text-white"
					>
						<CloseWindowIcon />
					</button>
				</div>
			</div>

			<div className="flex min-h-0 flex-1">
				<aside
					className={`shrink-0 overflow-hidden bg-[var(--c-chrome)] font-[family-name:var(--font-jetbrains-mono)] transition-[width] duration-150 ${sidebarOpen ? "w-60" : "w-0"}`}
				>
					<div className="flex h-full w-60 flex-col">
						<div className="min-h-0 flex-1 overflow-y-auto px-2 py-3">
							<div className="px-2 pb-2 text-xs font-semibold tracking-wider text-[var(--c-muted)]">EXPLORER</div>
							<Tree nodes={activeWorkspace.tree} depth={0} expanded={expanded} onToggleFolder={toggleFolder} activeId={activeId} onOpenFile={openFile} />
						</div>

						<div className="relative flex h-20 shrink-0 items-center justify-between border-t border-white/5 px-3">
							<button
								onClick={shiftWorkspace}
								aria-label="워크스페이스 전환"
								className="flex items-center gap-2 rounded-md py-1.5 pr-3 pl-2 transition-colors duration-150 hover:bg-white/10"
							>
								<span className="flex h-7 w-7 shrink-0 items-center justify-center text-white">
									<ShiftWorkspaceIcon />
								</span>
								<span className="text-sm font-semibold text-[var(--c-text)]">{activeWorkspace.label}</span>
							</button>

							<button
								onClick={() => setSettingsOpen((v) => !v)}
								aria-label="설정"
								className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[var(--c-text2)] transition-colors duration-150 hover:bg-white/10"
							>
								<GearIcon />
							</button>

							{settingsOpen && (
								<>
									<div className="fixed inset-0 z-40" onClick={() => setSettingsOpen(false)} />
									<div className="absolute right-3 bottom-full z-50 mb-2 w-48 overflow-hidden rounded-lg border border-white/10 bg-[var(--c-chrome)] py-1 shadow-lg shadow-black/40">
										<div className="px-3 pt-1.5 pb-1 text-[9px] font-semibold tracking-wider text-[var(--c-muted)] uppercase">Theme</div>
										{(Object.keys(THEMES) as ThemeId[]).map((id) => (
											<button
												key={id}
												onClick={() => {
													setThemeId(id);
													setSettingsOpen(false);
												}}
												className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs transition-colors duration-150 hover:bg-white/10 ${
													id === themeId ? "text-[var(--c-accent)]" : "text-[var(--c-text)]"
												}`}
											>
												<span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: THEMES[id].colors.accent }} />
												{THEMES[id].label}
												{id === themeId && <span className="ml-auto">✓</span>}
											</button>
										))}
									</div>
								</>
							)}
						</div>
					</div>
				</aside>

				<div className="flex min-w-0 flex-1 flex-col">
					<div className="flex min-h-0 flex-1">
						{isBlog ? (
							activeFile ? (
								<div className="h-full w-full overflow-y-auto bg-[var(--c-base)] px-8 py-6" style={{ fontFamily: "var(--font-inter), Pretendard, sans-serif" }}>
									<FileContent file={activeFile} />
								</div>
							) : (
								<div className="flex h-full w-full items-center justify-center text-[var(--c-muted)]">파일을 선택하세요</div>
							)
						) : openTabs.length > 0 ? (
							<div
								ref={scrollContainerRef}
								onScroll={handleContentScroll}
								className="h-full w-full overflow-y-auto bg-[var(--c-base)]"
								style={{ fontFamily: "var(--font-inter), Pretendard, sans-serif" }}
							>
								{openTabs.map((id) => {
									const file = filesById.get(id);
									if (!file) return null;
									return (
										<div
											key={id}
											ref={(el) => {
												if (el) sectionRefs.current.set(id, el);
												else sectionRefs.current.delete(id);
											}}
											className="border-b border-white/5 px-8 py-10 last:border-b-0"
										>
											<div className="mb-4 font-[family-name:var(--font-jetbrains-mono)] text-[11px] tracking-wider text-[var(--c-muted)] uppercase">{displayName(id)}</div>
											<FileContent file={file} />
										</div>
									);
								})}
							</div>
						) : (
							<div className="flex h-full w-full items-center justify-center text-[var(--c-muted)]">파일을 선택하세요</div>
						)}
					</div>

					{activeFile && (
						<div className="flex h-6 shrink-0 items-center justify-end gap-4 border-t border-white/5 bg-[var(--c-chrome)] px-3 font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[var(--c-muted)]">
							<span>{wordCount} words</span>
							<span>{charCount} characters</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
