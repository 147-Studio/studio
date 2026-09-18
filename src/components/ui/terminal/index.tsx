import React, { useState } from "react";
import styles from "./styles.module.scss";
import { motion } from "motion/react";
import { mainEase } from "@/config/ease";
import Terminal, { ColorMode, TerminalOutput } from "react-terminal-ui";

/* ---------------- DATA ---------------- */

const chapters = [
  {
    id: 1,
    title: "Introduction",
    subtitles: ["What is Linux?", "Why Linux?", "Linux Distributions"],
  },
  {
    id: 2,
    title: "Linux Installation",
    subtitles: ["Download ISO", "Create Bootable USB", "Install Ubuntu"],
  },
  {
    id: 3,
    title: "Shell Basics",
    subtitles: ["Navigation", "Files & Directories", "Permissions"],
  },
] as const;

const faqs = [
  {
    id: 1,
    question: "What is Linux?",
    answer: "Linux is an open-source operating system kernel.",
  },
  {
    id: 2,
    question: "How do I install Ubuntu?",
    answer: "Download the Ubuntu ISO and create a bootable USB drive.",
  },
  {
    id: 3,
    question: "What is Bash?",
    answer: "Bash is a command-line shell commonly used on Linux systems.",
  },
] as const;

/* ---------------- TYPES ---------------- */

type Flags = Record<string, string>;

type Command = {
  description: string;
  usage: string;
  args?: { flag: string; description: string }[];
  allowedFlags: string[];
  allowPositional?: boolean;
  execute: (flags: Flags) => string[];
};

/* ---------------- PARSER ---------------- */

function parseCommand(input: string) {
  const parts = input.trim().split(/\s+/);

  const command = parts[0]?.toLowerCase() ?? "";

  const flags: Record<string, string> = {};
  const args: string[] = [];

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];

    if (part.startsWith("-")) {
      const value = parts[i + 1];

      if (value && !value.startsWith("-")) {
        flags[part] = value;
        i++;
      } else {
        flags[part] = "";
      }
    } else {
      args.push(part);
    }
  }

  return { command, flags, args };
}

/* ---------------- COMMANDS ---------------- */

const commands: Record<string, Command> = {
  chapters: {
    description: "Show course chapters or chapter details",
    usage: "chapters -c <id>",
    allowedFlags: ["-c"],
    allowPositional: false,
    args: [{ flag: "-c", description: "chapter id (number)" }],

    execute: (flags) => {
      const id = flags["-c"];

      if (!id) {
        return [
          "Available chapters:",
          "",
          ...chapters.map((c) => `${c.id}. ${c.title}`),
        ];
      }

      const chapter = chapters.find((c) => c.id === Number(id));

      if (!chapter) {
        return [`Chapter ${id} not found.`];
      }

      return [
        `Chapter: ${chapter.title}`,
        "",
        ...chapter.subtitles.map((s, i) => `${i + 1}. ${s}`),
      ];
    },
  },

  faq: {
    description: "Show FAQs or answer a specific question",
    usage: "faq -q <id>",
    allowedFlags: ["-q"],
    allowPositional: false,
    args: [{ flag: "-q", description: "question id (number)" }],

    execute: (flags) => {
      const id = flags["-q"];

      if (!id) {
        return [
          "Frequently Asked Questions:",
          "",
          ...faqs.map((f) => `${f.id}. ${f.question}`),
        ];
      }

      const faq = faqs.find((f) => f.id === Number(id));

      if (!faq) {
        return [`Question ${id} not found.`];
      }

      return [faq.question, "", faq.answer];
    },
  },
};

/* ---------------- HELP ---------------- */

function helpCommand(target?: string): string[] {
  if (!target) {
    return [
      "Available commands:",
      "",
      ...Object.entries(commands).map(
        ([name, cmd]) => `- ${name}: ${cmd.description}`,
      ),
      "",
      "Usage: help <command>",
    ];
  }

  const cmd = commands[target];

  if (!cmd) {
    return [`No help found for '${target}'`];
  }

  return [
    `Command: ${target}`,
    "",
    `Description: ${cmd.description}`,
    "",
    `Usage: ${cmd.usage}`,
    "",
    "Arguments:",
    ...(cmd.args?.map((a) => `${a.flag} → ${a.description}`) || [
      "(no arguments)",
    ]),
  ];
}

/* ---------------- VALIDATION ---------------- */

function validateCommand(
  cmd: Command,
  flags: Flags,
  args: string[],
): string[] | null {
  // ❌ positional args not allowed
  if (!cmd.allowPositional && args.length > 0) {
    return [`Unexpected argument: ${args[0]}`];
  }

  // ❌ unknown flags
  for (const flag of Object.keys(flags)) {
    if (!cmd.allowedFlags.includes(flag)) {
      return [`Unknown flag: ${flag}`];
    }
  }

  return null;
}

/* ---------------- COMPONENT ---------------- */

const TerminalWrapper = () => {
  const [terminalIsOpen, setTerminalIsOpen] = useState(false);

  const [terminalLineData, setTerminalLineData] = useState<React.ReactNode[]>([
    <TerminalOutput key="welcome">
      Welcome to the Linux Course Terminal
    </TerminalOutput>,
    <TerminalOutput key="h1">chapters → list chapters</TerminalOutput>,
    <TerminalOutput key="h2">chapters -c 1 → chapter details</TerminalOutput>,
    <TerminalOutput key="h3">faq → list questions</TerminalOutput>,
    <TerminalOutput key="h4">faq -q 1 → show answer</TerminalOutput>,
    <TerminalOutput key="h5">help → command help</TerminalOutput>,
    <TerminalOutput key="h6">clear → reset terminal</TerminalOutput>,
  ]);

  const appendLines = (lines: string[]) =>
    lines.map((line) => (
      <TerminalOutput key={crypto.randomUUID()}>{line}</TerminalOutput>
    ));

  /* ---------------- INPUT ---------------- */

  const onInput = (input: string) => {
    const { command, flags, args } = parseCommand(input);

    if (command === "clear") {
      setTerminalLineData([]);
      return;
    }

    let output: string[];

    if (command === "help") {
      const target = args[0];
      output = helpCommand(target);
    } else {
      const cmd = commands[command];

      if (!cmd) {
        output = [`Unknown command: ${command}`, "", "Type: help"];
      } else {
        const error = validateCommand(cmd, flags, args);

        if (error) {
          output = error;
        } else {
          output = cmd.execute(flags);
        }
      }
    }

    setTerminalLineData((prev) => [
      ...prev,

      <TerminalOutput key={crypto.randomUUID()}>
        <>
          <span style={{ color: "gray", marginRight: "0.75rem" }}>
            student@linux-course:~$
          </span>
          {input}
        </>
      </TerminalOutput>,

      ...appendLines(output),
    ]);
  };

  /* ---------------- UI ---------------- */

  return (
    <>
      <div
        style={{
          position: "fixed",
          width: 50,
          height: 50,
          bottom: 20,
          right: 20,
          borderRadius: 100,
          background: "orange",
          zIndex: 100,
        }}
        onClick={() => setTerminalIsOpen((v) => !v)}
      />

      <motion.div
        className={styles.window}
        initial={{ y: "100%" }}
        animate={{ y: terminalIsOpen ? 0 : "100%" }}
        transition={{ duration: 0.6, ease: mainEase }}
        data-lenis-prevent-wheel
      >
        <div style={{ width: "60%" }}>
          <Terminal
            name="Linux Course Terminal"
            colorMode={ColorMode.Dark}
            onInput={onInput}
            prompt="student@linux-course:~$"
          >
            {terminalLineData}
          </Terminal>
        </div>
      </motion.div>
    </>
  );
};

export default TerminalWrapper;
