import { Generator } from "../card";
import { Item } from "../item";
import { Extension } from "../types";

const statuses: Record<string, string> = {
    Accepted: "AC",
    "Wrong Answer": "WA",
    "Time Limit Exceeded": "TLE",
    "Memory Limit Exceeded": "MLE",
    "Output Limit Exceeded": "OLE",
    "Runtime Error": "RE",
    "Compile Error": "CE",
    "System Error": "SE",
};

const langs: Record<string, string> = {
    cpp: "C++",
    java: "Java",
    python: "Python",
    python3: "Python",
    mysql: "MySQL",
    c: "C",
    csharp: "C#",
    javascript: "JavaScript",
    ruby: "Ruby",
    bash: "Bash",
    swift: "Swift",
    golang: "Go",
    scala: "Scala",
    kotlin: "Kotlin",
    rust: "Rust",
    php: "PHP",
    typescript: "TypeScript",
    racket: "Racket",
    erlang: "Erlang",
    elixir: "Elixir",
};

export function ActivityExtension(generator: Generator): Extension {
    return async (generator, data, body, styles) => {
        if (generator.config.height < 400) {
            generator.config.height = 400;
        }

        const submissions = data.submissions.slice(0, 5);

        const extension = new Item({
            type: "g",
            attr: { id: "ext-activity" },
            style: { transform: `translate(0px, 200px)` },
            children: [
                new Item({
                    type: "line",
                    attr: { x1: 10, y1: 0, x2: generator.config.width - 20, y2: 0 },
                    style: { stroke: "var(--bg-1)", "stroke-width": 1 },
                }),
                new Item({
                    type: "text",
                    content: "Recent Activities",
                    attr: { id: "ext-activity-title" },
                    style: {
                        transform: `translate(20px, 20px)`,
                        fill: "var(--text-0)",
                        opacity: generator.config.animation !== false ? 0 : 1,
                        animation:
                            generator.config.animation !== false
                                ? "fade_in 1 0.3s 1.7s forwards"
                                : "",
                    },
                }),
                new Item({
                    type: "defs",
                    children: [
                        new Item({
                            type: "linearGradient",
                            attr: {
                                id: "ext-activity-mask-gradient",
                                x1: "0",
                                y1: "0",
                                x2: "1",
                                y2: "0",
                            },
                            children: [
                                new Item({
                                    type: "stop",
                                    attr: { offset: "0%", "stop-color": "#fff" },
                                }),
                                new Item({
                                    type: "stop",
                                    attr: { offset: "85%", "stop-color": "#fff" },
                                }),
                                new Item({
                                    type: "stop",
                                    attr: { offset: "100%", "stop-color": "#000" },
                                }),
                            ],
                        }),
                        new Item({
                            type: "mask",
                            attr: { id: "ext-activity-mask" },
                            children: [
                                new Item({
                                    type: "rect",
                                    style: {
                                        fill: "url(#ext-activity-mask-gradient)",
                                        width: `${generator.config.width - 225 - 20}px`,
                                        height: "24px",
                                        transform: "translate(0, -14px)",
                                    },
                                }),
                            ],
                        }),
                        new Item({
                            type: "clipPath",
                            attr: { id: "ext-activity-clip" },
                            children: [
                                new Item({
                                    type: "rect",
                                    style: {
                                        width: `${generator.config.width - 225 - 20}px`,
                                        height: "24px",
                                        transform: "translate(0, -14px)",
                                    },
                                }),
                            ],
                        }),
                    ],
                }),
            ],
        });

        for (let i = 0; i < submissions.length; i++) {
            const status = statuses[submissions[i].status] || "Unknown";
            const time = new Date(submissions[i].time);

            extension.children?.push(
                new Item({
                    type: "a",
                    attr: {
                        id: `ext-activity-item-${i}`,
                        href: `https://leetcode.${
                            generator.config.site === "us" ? "com" : "cn"
                        }/submissions/detail/${submissions[i].id}/`,
                        target: "_blank",
                    },
                    style: {
                        transform: `translate(0px, ${i * 32 + 45}px)`,
                        animation:
                            generator.config.animation !== false
                                ? `fade_in 0.3s ease ${(1.8 + 0.1 * i).toFixed(2)}s 1 backwards`
                                : "",
                    },
                    children: [
                        new Item({
                            type: "text",
                            content: `${time.getFullYear() % 100}.${
                                time.getMonth() + 1
                            }.${time.getDate()}`,
                            attr: {
                                textLength: 56,
                            },
                            style: {
                                transform: `translate(20px, 0)`,
                                fill: "var(--text-0)",
                                "alignment-baseline": "middle",
                            },
                        }),
                        new Item({
                            type: "rect",
                            style: {
                                transform: `translate(85px, -14px)`,
                                fill: `var(--color-${status === "AC" ? "1" : "3"})`,
                                width: "30px",
                                height: "24px",
                                rx: 4,
                            },
                        }),
                        new Item({
                            type: "text",
                            content: status,
                            style: {
                                transform: `translate(100px, 0)`,
                                fill: "#fff",
                                "text-anchor": "middle",
                                "alignment-baseline": "middle",
                            },
                        }),
                        new Item({
                            type: "text",
                            content: (langs[submissions[i].lang] || submissions[i].lang).slice(
                                0,
                                12,
                            ),
                            style: {
                                transform: `translate(125px, 0)`,
                                fill: "var(--text-0)",
                                "font-weight": "bold",
                                "alignment-baseline": "middle",
                            },
                        }),
                        new Item({
                            type: "text",
                            content: submissions[i].title,
                            style: {
                                "clip-path": "url(#ext-activity-clip)",
                                transform: `translate(225px, 0)`,
                                fill: "var(--text-1)",
                                "alignment-baseline": "middle",
                                mask: "url(#ext-activity-mask)",
                            },
                        }),
                    ],
                }),
            );
        }

        body["ext-activity"] = () => extension;
    };
}